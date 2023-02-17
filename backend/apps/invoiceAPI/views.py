from apps.models import Usuario, Facturacion, Cliente
from apps.invoiceAPI.serializers import UserSerializer, PendingInvoices, ClientesSerializer;
from django.db.models import Q
from rest_framework import viewsets


# Concrete Views
from rest_framework.generics import RetrieveAPIView, ListAPIView


class InvoiceDetailAPIView(RetrieveAPIView):
    lookup_field = 'cedula'
    lookup_url_kwarg = 'cedula'    

    queryset = Usuario.objects.all()
    serializer_class = UserSerializer

class PendingInvoicesAPIView(ListAPIView):
    lookup_field = 'cedula'
    lookup_url_kwarg = 'cedula'    

    queryset = Facturacion.objects.filter(Q(estadoPago='Sin pagar') | Q(estadoPago='En mora'))
    serializer_class = PendingInvoices
 
class ClientesViewset(viewsets.ModelViewSet):
    queryset = Usuario.objects.filter(rol="Cliente")
    serializer_class = ClientesSerializer