# TRABAJO-FINAL---TUPAD

## Integrantes
- Grupo: 210
- Alumnos: Palacios Agustin; Martinez Juan
- Tutor a cargo: Gerardo Adrian Herrera

## Introducción
El siguiente Trabajo Final de la carrera Tecnicatura Universitaria en Programacion a Distancia consiste en el desarrollo de un sistema de gestión de turnos para una institución de salud, diseñado para facilitar la organización y administración de las citas entre pacientes y profesionales.
Poniendo en practica los conocimeintos y herramientas adquiridos durante la cursada, integrando diferentes conceptos de frontend, backend y base de datos.

### Problematica
En clínicas y centros de salud de escala pequeña o mediana, la gestión de turnos suele resolverse todavía de forma manual: planillas de cálculo, agendas físicas por profesional y coordinación telefónica entre recepción y pacientes. Esta forma de trabajo depende en gran parte del criterio y la disponibilidad del personal administrativo, que debe consultar distintas fuentes de información para saber qué horarios están realmente libres en cada momento.

### Solucion a plantear
Se propone el desarrollo de una aplicación web que centralice la gestión de turnos de la clínica en una única plataforma accesible desde cualquier dispositivo con conexión a internet, eliminando la dependencia de planillas dispersas y comunicación telefónica como única vía de coordinación.

### El valor agregado
El valor agregado implica la habilitacion de algo que antes no era posible o no era eficiente. En este proyecto, eso se traduce en: reducir el tiempo administrativo que hoy se destina a coordinar agendas manualmente, ya que la adminsitracion de los turnos pasa a ser un proceso del sistema y el usuario es quien gestiona su propio turno; tambien se trata la eliminacion estructural de errores tecnicos, como por ejemplo, la doble reserva de horarios, entre otros.

## Estructura del proyecto
```
gestion-turnos/
├── backend/                      # API REST en Node.js + TypeScript
│   ├── prisma/
│   │   └── schema.prisma         # Esquema de base de datos relacional
│   ├── src/
│   │   ├── controllers/          # Controladores
│   │   ├── services/             # Lógica de negocio y reglas de turnos
│   │   ├── routes/               # Rutas y endpoints
│   │   ├── middlewares/          # Manejo de errores
│   │   ├── types/                # Interfaces y tipos TypeScript
│   │   ├── config/               # Configuración de base de datos y variables
│   │   └── index.ts              # Entrada al servidor
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── frontend/                     # Aplicación React + Vite con CSS
│   ├── src/
│   │   ├── assets/               # Imágenes, logos e iconos
│   │   ├── components/           # Componentes reutilizables con sus estilos
│   │   │   ├── Navbar/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Navbar.css
│   │   │   ├── Calendar/
│   │   │   │   ├── Calendar.jsx
│   │   │   │   └── Calendar.css
│   │   │   ├── Button/
│   │   │   │   ├── Button.jsx
│   │   │   │   └── Button.css
│   │   │   └── ModalTurno/
│   │   │       ├── ModalTurno.jsx
│   │   │       └── ModalTurno.css
│   │   ├── views/                # Vistas principales
│   │   │   ├── Home/
│   │   │   │   ├── Home.jsx
│   │   │   │   └── Home.css
│   │   │   ├── ReservaTurno/
│   │   │   │   ├── ReservaTurno.jsx
│   │   │   │   └── ReservaTurno.css
│   │   │   ├── PanelMedico/
│   │   │   └── Login/
│   │   ├── services/             # Peticiones HTTP a la API
│   │   ├── styles/               # Estilos globales y diseño del sistema
│   │   │   ├── variables.css     # Colores de la clínica, fuentes, espaciados
│   │   │   ├── reset.css         # Reseteo de márgenes y box-sizing
│   │   │   └── global.css        # Tipografías base y estilos comunes
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── .env.example
│
├── database/                     # Scripts y documentación
│   ├── ddl/
│   │   └── 01_create_tables.sql  # Creación de tablas, claves foráneas e índices
│   └── dml/
│       └── 02_initial_seeds.sql  # Inserción de especialidades, admin y roles
│
├── docs/                         # Informes y documentación
│
├── .gitignore
└── README.md                     # Documentación principal del repositorio
```


## Tecnologias a utilizar

- Frontend: Javascript/Typescript, React, HTML y CSS
- Backend: Typescript
- Base de datos: MySQL
- Despliegue del frontend: Vercel
- Despliegue del backend: Railway

El stack tecnologico propuesto son herramientas vistas durante la cursada de la carrera, pero como equipo tambien contemplamos la posibilidad de ajustar alguna tecnologia sobre la marcha si surge alguna necesitad en concreto.
### Justificacion de cada tecnologia
- Frontend (React + TS/JS + HTML/CSS): React permite organizar en componentes reutilizables las distintas vistas por rol (paciente, administrativo, profesional), y TypeScript agrega tipado estático que ayuda a prevenir errores en un dominio con muchas relaciones entre datos (turnos, pacientes, profesionales).
- Backend (TypeScript): usar el mismo lenguaje en frontend y backend permite compartir tipos entre ambas capas y reduce el cambio de contexto entre lenguajes. Es adecuado para la escala del proyecto, centrada en operaciones CRUD y consultas relacionales.
- Base de datos (MySQL): En este caso, se necesita una base de datos relacional porque el dominio tiene reglas de integridad estrictas (por ejemplo, evitar turnos superpuestos), algo que un modelo relacional garantiza mejor que uno NoSQL.
- Despiegles de backend y frontend: estas plataformas permiten desplegar frontend y backend sin gestionar infraestructura propia y son utiles para la escala del proyecto.

## Desarrollo por Etapas

### Etapa 1: Núcleo Operativo y Reserva Online (MVP)
- **Módulo de autenticación:**
  - Registro e inicio de sesión.
  - Control de acceso basado en roles
  - Persistencia de la sesión.
- **Módulo de Pacientes:**
  - Búsqueda de turnos filtrada por especialidad, profesional, cobertura y fecha.
  - Reserva en horatios disponibles.
  - Panel de gestión de turnos propios.
  - Confirmación automática por correo electrónico.
- **Módulo de Profesionales Médicos:**
  - Visualización de agenda diaria y semanal.
  - Configuración de disponibilidad horaria y bloqueo de fechas.
- **Módulo de Administración y Recepción:**
  - ABM (CRUD) de médicos, especialidades, consultorios y coberturas.
  - Mesa de entrada para registro de pacientes.