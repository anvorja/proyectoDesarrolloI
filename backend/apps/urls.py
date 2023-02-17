from django.urls import path
from rest_framework import routers

from .api import *
from .views import *

router = routers.DefaultRouter()
router.register('api/usuario', UsuarioViewset, basename='usuario')
router.register('api/subsidio', SubsidioViewset, basename='subsidio')
router.register('api/cliente', ClienteViewset, basename='cliente')
router.register('api/facturacion', FacturacionViewset, basename='facturacion')
router.register('api/facturacion/<int:pk>',
                FacturacionViewset, basename='facturacion')
router.register('api/pago', PagoViewSet, basename='pago')
router.register('api/valorUnitario', FacturaViewset, basename='valorUnitario')


urlpatterns = router.urls
urlpatterns += path('api/facturacion/generar', CrearFacturasViewset.as_view()),
# urlpatterns += path('api/invoice-pdf/', get_invoice.as_view()),
urlpatterns += path('api/usuario/modificar/<int:cedula>/', modificarUsuario.as_view()),
urlpatterns += path('api/facturacion/send_invoice', send_invoice.as_view()),
