import datetime
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import *

User = get_user_model()


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('cedula','rol','nombre','apellidos','fechaNacimiento', 'telefono', 'email', 'estado', 'password') 
    def create(self, validated_data):
        usuario = User.objects.create_user(
            cedula = validated_data['cedula'],
            rol = validated_data['rol'],
            nombre = validated_data['nombre'],
            apellidos = validated_data['apellidos'],
            fechaNacimiento = validated_data['fechaNacimiento'],
            telefono = validated_data['telefono'],
            email = validated_data['email'],
            password=validated_data['password'],
        )
        return usuario
    def update_password(self, cedula, new_password):
        User.objects.update_password(cedula = cedula,new_password = new_password)

        
class SubsidioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subsidio
        fields = ('estrato','porcentaje') 

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ('cedula','suspendido','direccion', 'estrato') 


class FacturacionSerializer(serializers.ModelSerializer):
    fechaVencimiento = serializers.SerializerMethodField()
    vu = 0
    costoTotal = serializers.SerializerMethodField()


    class Meta:
        model = Facturacion
        fields = ('id','fechaPago','consumo','estadoPago', 'cedula', 'fechaVencimiento', 'costoTotal')

    def get_fechaVencimiento(self, object):
            start_time = object.fechaPago
            timeIn7Days = start_time+datetime.timedelta(days=7)

            return timeIn7Days


    def get_costoTotal(self, object):
            cliente = object.cedula
            subsidio_porcentaje = cliente.estrato.porcentaje
            
            factura = Factura.objects.get(id=1)
            mora_porc = factura.porcentajeMora
            vu = factura.valorUnitario
            costo= vu*object.consumo
            if object.estadoPago != "En mora":
                return costo*(1-subsidio_porcentaje)
            else:
                return costo*(1-subsidio_porcentaje + mora_porc)



        
class PagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pago
        fields = ('numeroFactura','monto','fecha') 
            
class FacturaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Factura
        fields = ["valorUnitario", 'porcentajeMora']  
          
