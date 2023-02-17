from datetime import date

from apps.invoiceAPI.serializers import ClientesSerializer, InvoiceSerializer
from django.contrib.auth import get_user_model
from django.core.mail import EmailMessage
from django.db import transaction
from django.http import HttpResponse
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .models import *
from .serializers import *
from .views import *
import json
import requests

User = get_user_model()


class UsuarioViewset(viewsets.ModelViewSet):
    serializer_class = UsuarioSerializer

    def get_queryset(self):
        usuarios = Usuario.objects.all()
        return usuarios

    def create(self, request, *args, **kwargs):
        data = request.data
        serializer = UsuarioSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        usuario = serializer.create(serializer.validated_data)
        usuario = UsuarioSerializer(usuario)
        return Response(usuario.data, status=status.HTTP_201_CREATED)

    def perform_update(self, serializer):
        instance = serializer.save()
        cedula = self.request.data['cedula']
        new_password = self.request.data['password']
        serializer.update_password(cedula, new_password)


class modificarUsuario(APIView):
    http_method_names = ['post']

    def post(self, request, *args, **kwargs):
        cedula = request.data['cedula']
        usuario = Usuario.objects.get(cedula=int(cedula))
        for key, dato in request.data.items():
            if key != 'password':
                setattr(usuario, key, dato)
        usuario.save()
        serializer = UsuarioSerializer(usuario,  many=False)
        return HttpResponse({json.dumps(serializer.data)}, status=status.HTTP_200_OK)


class SubsidioViewset(viewsets.ModelViewSet):
    queryset = Subsidio.objects.all()
    serializer_class = SubsidioSerializer


class ClienteViewset(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer


class FacturacionViewset(viewsets.ModelViewSet):
    queryset = Facturacion.objects.all()
    serializer_class = FacturacionSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cedula']

    def perform_create(self, serializer):
        instance = serializer.save()
        nueva_fact = serializer.data
        cedula = nueva_fact.get('cedula')
        cliente = Cliente.objects.get(cedula=int(cedula))
        facts_cliente = Facturacion.objects.filter(
            cedula=int(cedula)).order_by('-id')
        if facts_cliente.__len__() > 1:
            fact_anterior = facts_cliente[1]
            if fact_anterior.estadoPago == "Sin pagar":
                fact_anterior.estadoPago = "En mora"
                fact_anterior.save()
        if facts_cliente.__len__() > 2:
            facts_cliente = facts_cliente[1:3]
            if all(fact.estadoPago == "En mora" for fact in facts_cliente):
                cliente.suspendido = True
                cliente.save()


class CrearFacturasViewset(APIView):
    def post(self, request, format=None):
        year, month, day = request.data['fechaCorte'].split("-")
        if not len(day)==2:
            day= '0'+day
        if not len(month)==2:
            month= '0'+month
        fechaCorte = date.fromisoformat(year+"-"+month+"-"+day)
        
        clientes = Cliente.objects.all()
        facts = []
        url = "https://energy-service-ds-v3cot.ondigitalocean.app/consumption"
        headers = {
            'Content-Type': 'application/json'
        }
        for cliente in clientes:
            payload = json.dumps({
                "client_id": str(cliente.cedula)
            })
            response = requests.request(
                "POST", url, headers=headers, data=payload)
            consumo = response.json().get('energy consumption')
            nueva_factura = Facturacion.objects.create(
                fechaPago=fechaCorte, consumo=consumo, cedula=cliente)
            nueva_factura.save()
            facturas = Facturacion.objects.filter(
                cedula=cliente).order_by("-fechaPago")[:5]
            client = ClientesSerializer(cliente.cedula, many=False).data
            client['invoices'] = InvoiceSerializer(facturas, many=True).data
            facts.append(client)
            #send_invoice(dict(client))
        return Response(facts, status=status.HTTP_201_CREATED)


class PagoViewSet(viewsets.ModelViewSet):
    serializer_class = PagoSerializer

    def get_queryset(self):
        pagos = Pago.objects.all()
        return pagos

    def create(self, request, *args, **kwargs):
        monto = request.data['monto']
        numeroFactura = request.data['numeroFactura']
        with transaction.atomic():
            factura = Facturacion.objects.get(pk=int(numeroFactura))
            nuevo_pago = Pago.objects.create(
                monto=float(monto), numeroFactura=factura)
            nuevo_pago.save()
            serializer = PagoSerializer(nuevo_pago)
            factura.estadoPago = 'Pagado'
            factura.save()
            FacturacionSerializer(factura)
            cliente = factura.cedula
            if cliente.suspendido:
                facts = Facturacion.objects.filter(cedula=cliente)
                if all(fact.estadoPago == 'Pagado' for fact in facts):
                    cliente.suspendido = False
                    cliente.save()
                    ClienteSerializer(cliente)
            return Response(serializer.data, status=status.HTTP_201_CREATED)


class FacturaViewset(viewsets.ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer


class GoogleApi(APIView):
    authentication_classes = ()
    permission_classes = ()

    def post(self, request, *args, **kwargs):
        id_token = request.headers.get('Authorization')
        response = requests.get(
            'https://www.googleapis.com/oauth2/v3/tokeninfo',
            params={'id_token': id_token}
        )
        if response.ok:
            email = request.data.get('email')
            try:
                usuario = Usuario.objects.get(email=email)

                refresh = RefreshToken.for_user(usuario)
                response = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'cedula': usuario.cedula,
                }

                return Response(response, status=status.HTTP_200_OK)
            except:
                return Response({}, status=status.HTTP_404_NOT_FOUND)


class send_invoice(APIView):

    def post(self, request, *args, **kwargs):
        nombre = request.data['nombre']
        numeroFac = request.data['numeroFac']
        correo = request.data['correo']
        costoTotal = request.data['costoTotal']
        pdf = request.data['pdf']
        email = EmailMessage(
            "Factura " + str(numeroFac),
            "Hola " + nombre + ",\nEnergy X te informa que se te ha generado una nueva factura por: $" +
            str(costoTotal) +
            "\nIngresa a energyapp.com/Cliente/invoice/ para conocer mas.",
            'energyapp2@gmail.com',
            [correo],
            [],
            headers={'Message-ID': 'foo'},
        )
        email.attach("invoice.pdf", pdf.read(), "application/pdf")
        email.send()
        return Response({}, status=status.HTTP_200_OK)


""" class get_invoice(APIView):
    def get(self, request, *args, **kwargs):
        context = {
            "direccion": "cra 5ta, Cali, Valle del cauca",
            "cedula": 1062276960,
            "nombre": "Juan Jose",
            "apellidos": "Viafara",
            "invoices": [
                {
                    "id": 39,
                    "fechaVencimiento": "2023-07-07",
                    "fechaPago": "2023-06-30",
                    "consumo": 5,
                    "estadoPago": "Sin pagar",
                    "valorUnitariokWh": 803,
                    "costoTotal": 2409
                },
                {
                    "id": 41,
                    "fechaVencimiento": "2023-07-07",
                    "fechaPago": "2023-06-30",
                    "consumo": 83,
                    "estadoPago": "Sin pagar",
                    "valorUnitariokWh": 803,
                    "costoTotal": 39989.4
                },
                {
                    "id": 42,
                    "fechaVencimiento": "2023-07-07",
                    "fechaPago": "2023-06-30",
                    "consumo": 44,
                    "estadoPago": "Sin pagar",
                    "valorUnitariokWh": 803,
                    "costoTotal": 21199.2
                },
                {
                    "id": 40,
                    "fechaVencimiento": "2023-07-07",
                    "fechaPago": "2023-06-30",
                    "consumo": 64,
                    "estadoPago": "Sin pagar",
                    "valorUnitariokWh": 803,
                    "costoTotal": 30835.2
                },
                {
                    "id": 43,
                    "fechaVencimiento": "2023-07-07",
                    "fechaPago": "2023-06-30",
                    "consumo": 81,
                    "estadoPago": "Sin pagar",
                    "valorUnitariokWh": 803,
                    "costoTotal": 39025.8
                }
            ]
        }
        context['javascript'] = '/static/js/main.6056df08.js'
        context['css'] = '/static/css/main.68de123f.css'
        context['logo'] = '/static/media/logo.d7462ac56567ac23e75e.png'
        return render_invoice(context)
 """