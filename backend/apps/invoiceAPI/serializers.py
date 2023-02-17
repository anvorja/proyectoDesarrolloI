from rest_framework import serializers

from apps.serializers import FacturaSerializer, FacturacionSerializer, ClienteSerializer
from apps.models import Cliente, Facturacion, Usuario, Factura
import datetime


class InvoiceSerializer(serializers.ModelSerializer):
    fechaVencimiento = serializers.SerializerMethodField()
    valorUnitariokWh = serializers.SerializerMethodField()
    vu = 0
    costoTotal = serializers.SerializerMethodField()

    class Meta:
        model = Facturacion
        fields = ["id", "fechaVencimiento", "fechaPago", "consumo",
                  "estadoPago", "valorUnitariokWh", "costoTotal"]

    def get_fechaVencimiento(self, object):
        return FacturacionSerializer.get_fechaVencimiento(self, object)

    def get_valorUnitariokWh(self, object):
        valorUnitario = Factura.objects.get(id=1)
        serializer = FacturaSerializer(valorUnitario)
        vu = (serializer.data)['valorUnitario']
        self.vu = (serializer.data)['valorUnitario']
        return vu

    def get_costoTotal(self, object):
        return FacturacionSerializer.get_costoTotal(self, object)


class ClientSerializer(serializers.ModelSerializer):
    invoices = InvoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Cliente
        fields = ["invoices", "cedula", "direccion", "suspendido"]



class UserSerializer(serializers.ModelSerializer):
    clientInfo = ClientSerializer(many=False, read_only=True)

    class Meta:
        model = Usuario
        fields = ["clientInfo", "nombre", "apellidos"]


class PendingInvoices(serializers.ModelSerializer):
    fechaVencimiento = serializers.SerializerMethodField()
    costoTotal = serializers.SerializerMethodField()

    class Meta:
        model = Facturacion
        fields=["id","fechaVencimiento","fechaPago", "costoTotal", "estadoPago"]

    def get_fechaVencimiento(self, object):
        return FacturacionSerializer.get_fechaVencimiento(self, object)

    def get_costoTotal(self, object):
        return FacturacionSerializer.get_costoTotal(self, object)


class ClientesSerializer(serializers.ModelSerializer):
    clientInfo = ClienteSerializer(many=False, read_only=True)
    class Meta:
        model = Usuario
        fields = ['clientInfo','cedula','rol','nombre','apellidos','fechaNacimiento', 'telefono', 'email', 'estado']    