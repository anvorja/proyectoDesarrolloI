from django.urls import path
from apps.invoiceAPI.views import InvoiceDetailAPIView, PendingInvoicesAPIView, ClientesViewset

urlpatterns=[
    path('facturacion/<int:cedula>', InvoiceDetailAPIView.as_view(),name="invoice-detail"),
    path('facturacion/pendientes/<int:cedula>', PendingInvoicesAPIView.as_view(), name="pendingInvoices" ),
    path('all/', ClientesViewset.as_view({'get': 'list'}), name="clientes" )
]

