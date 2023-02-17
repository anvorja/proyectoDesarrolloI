# Proyecto EnergyApp DS1





### Backend
Para levantar el servidor del backend y la base de datos ejecute desde la carpeta raiz:
```bash
 docker-compose up 
```
Desde otra terminal, tambien desde la raiz ejecute (solo la primera vez):

```bash
 docker-compose exec backend_rdp python manage.py migrate
```

* localhost:8000

Si el servidor del backend no inicio 
ejecute en otra terminal 

```bash
  docker-compose exec backend_rdp python manage.py runserver 0.0.0.0:8000
```
### Frontend

* localhost:3000
