# Taskmaster
Proyecto integrador final.

TaskMaster es una herramienta diseñada para ayudar a gestionar tareas diarias y actividades pendientes de forma organizada. Con TaskMaster, se podrá crear tareas, organizarlas por categorías, hacerles seguimiento en su estado de avance. Además, se podrá asignar una fecha de vencimiento para que llevar un mejor control de las actividades.

Este proyecto se implementó mediante:

Backend: Django, Django REST Framework, JWT para autenticación.
Frontend: React, Axios, React Bootstrap para el diseño.
Base de Datos: SQLite
Herramientas: Postman para pruebas de la API

Para el registro e inicio de sesion de los usuarios se utilizó JWT. 

Instrucciones para ejecutar el proyecto:

1. Descargar el repositorio. 
2. Activar el entorno virtual en la terminal: source ./entorno/Scripts/activate
3. cd backend/ 
4. Instalar las siguientes dependencias

pip install django
pip install djangorestframework
pip install djangorestframework-simplejwt
pip install django-cors-headers

python manage.py migrate
python manage.py runserver

Para acceder al frontend, en una nueva terminal: 
1. Activar el entorno virtual: source ./entorno/Scripts/activate
2. cd frontend/
3. npm install
4. npm start
