# Casos de Uso e Historias de Usuario

## Alcance y actores

Los casos describen el comportamiento funcional esperado de la aplicación. Son una especificación objetivo y no indican que los flujos estén implementados en el backend.

- **Paciente:** se registra, consulta disponibilidad y gestiona sus turnos.
- **Médico:** consulta su agenda y administra la disponibilidad dentro de los permisos definidos.
- **Administrador/Recepción:** administra catálogos y asignaciones, reserva turnos por mesa de entrada y opera turnos según autorización.
- **Servicio de correo:** actor externo que recibe solicitudes de notificación después de confirmar la transacción.

## Casos de Uso

### UC-01: Registrarse e iniciar sesión

**Actor principal:** Paciente o usuario registrado. **Requerimientos:** RF-01, RF-02, RF-03.

**Precondiciones:** Para iniciar sesión, existe una cuenta activa. Para registrarse, el email y DNI no están asociados a otra cuenta.

**Flujo principal:**
1. El paciente ingresa sus datos personales y credenciales, o el usuario ingresa email y contraseña.
2. La aplicación valida campos, unicidad de email/DNI y credenciales.
3. En el registro, crea el usuario y el perfil de paciente. En el inicio de sesión, emite una sesión autenticada con el rol correspondiente.
4. La aplicación permite acceder únicamente a las funciones autorizadas para ese rol.

**Alternativas:** Datos inválidos o duplicados producen errores de validación; credenciales incorrectas o cuenta inactiva impiden el acceso sin revelar información sensible.

**Postcondición:** Registro persistido o sesión válida establecida; las contraseñas nunca se almacenan en texto plano.

### UC-02: Buscar disponibilidad

**Actor principal:** Paciente. **Requerimientos:** RF-04, RF-05, RF-06.

**Precondiciones:** Los catálogos públicos están disponibles y los médicos tienen agenda configurada.

**Flujo principal:**
1. El paciente selecciona especialidad, cobertura, profesional opcional y rango de fechas.
2. La aplicación verifica compatibilidad de cobertura y genera las franjas dentro del horario configurado.
3. Excluye bloqueos, turnos confirmados y franjas que no cumplan las reglas de anticipación.
4. Presenta profesionales, consultorios y horarios disponibles.

**Alternativas:** Si no hay resultados, la aplicación informa que no encontró disponibilidad y permite cambiar filtros. Si la cobertura no es aceptada, ofrece búsqueda particular cuando corresponda.

**Postcondición:** No se modifica ningún turno.

### UC-03: Reservar un turno en línea

**Actor principal:** Paciente. **Requerimientos:** RF-06, RF-07, RF-15, RF-16, RF-17.

**Precondiciones:** Sesión de paciente válida; franja disponible; se cumplen anticipación mínima y límite de turnos activos.

**Flujo principal:**
1. El paciente selecciona una franja y confirma cobertura y datos de la solicitud.
2. La aplicación inicia una transacción y bloquea médico y consultorio en orden estable.
3. Vuelve a validar asignación, bloqueos y solapamientos para ambos recursos.
4. Crea el turno `CONFIRMADO` y su evento de alta; confirma la transacción.
5. Tras el commit, solicita el envío del correo de confirmación.

**Alternativas:** Si la franja dejó de estar disponible, revierte la operación y ofrece actualizar resultados. Si falla una validación o la escritura, no queda un turno parcial ni se envía una confirmación de reserva.

**Postcondición:** Existe un turno confirmado o no se produjo ningún cambio; la operación es auditable.

### UC-04: Asignar un turno por mesa de entrada

**Actor principal:** Administrador/Recepción. **Requerimientos:** RF-07, RF-13, RF-16, RF-18.

**Precondiciones:** Usuario con rol autorizado; paciente identificado por DNI o registrado según el procedimiento institucional.

**Flujo principal:**
1. Recepción busca al paciente por DNI.
2. Selecciona profesional, cobertura, consultorio y franja disponible.
3. La aplicación verifica permisos, elegibilidad y disponibilidad transaccional de médico y consultorio.
4. Confirma el turno y registra actor, origen de mesa de entrada y evento de auditoría.
5. Informa el resultado y, si está configurado, envía la notificación después del commit.

**Alternativas:** Si no existe el paciente, se informa que debe registrarse o seguir el flujo institucional de alta. Si existe conflicto de agenda, la operación se revierte.

**Postcondición:** Turno confirmado y trazable, o sin cambios si la operación no pudo completarse.

### UC-05: Consultar y cancelar un turno

**Actor principal:** Paciente o Administrador/Recepción. **Requerimientos:** RF-08, RF-16, RF-17.

**Precondiciones:** El turno existe; el actor está autenticado y autorizado. La cancelación autónoma respeta la ventana de RF-05.

**Flujo principal:**
1. El actor consulta el turno y su estado.
2. Solicita cancelación e informa un motivo cuando corresponda.
3. La aplicación valida propiedad, permisos, estado y ventana aplicable.
4. En una transacción cambia el estado a `CANCELADO`, registra el evento y confirma.
5. El horario queda disponible para una nueva reserva y se notifica el cambio según la configuración.

**Alternativas:** Si venció la ventana de autogestión, el paciente debe contactar a administración. Un turno terminal no admite cancelación repetida; se informa el estado actual.

**Postcondición:** El registro se conserva y deja de ocupar disponibilidad futura.

### UC-06: Reprogramar un turno

**Actor principal:** Paciente, si la política lo permite, o Administrador/Recepción. **Requerimientos:** RF-07, RF-16, RF-17.

**Precondiciones:** Turno confirmado y actor autorizado; la nueva franja está disponible.

**Flujo principal:**
1. El actor selecciona una nueva franja.
2. La aplicación inicia una transacción y bloquea los recursos anteriores y nuevos en orden estable.
3. Valida la nueva disponibilidad y las reglas de negocio.
4. Marca el turno anterior `REPROGRAMADO`, crea el nuevo turno `CONFIRMADO` relacionado con el anterior y registra los eventos de ambos.
5. Confirma la transacción y luego solicita las notificaciones correspondientes.

**Alternativas:** Si la nueva franja no está disponible o falla una escritura, se revierte toda la operación y el turno original permanece confirmado.

**Postcondición:** La relación entre turno anterior y sucesor permite reconstruir la reprogramación.

### UC-07: Consultar agenda y registrar resultado de atención

**Actor principal:** Médico; Administrador/Recepción según permisos. **Requerimientos:** RF-09, RF-16, RF-17.

**Precondiciones:** Usuario autenticado y autorizado para consultar la agenda del profesional.

**Flujo principal:**
1. El actor consulta la agenda por día o semana.
2. La aplicación muestra turnos, horario, paciente y consultorio según permisos.
3. Una vez transcurrido el turno, el actor registra `ATENDIDO` o `AUSENTE`.
4. La aplicación valida la transición, guarda el cambio y registra el evento con actor y fecha.

**Alternativas:** No se permite marcar como atendido/ausente un turno futuro ni modificar un estado terminal mediante edición directa.

**Postcondición:** Agenda actualizada y resultado trazable.

### UC-08: Configurar agenda, bloqueos y catálogos

**Actor principal:** Médico o Administrador/Recepción, según operación. **Requerimientos:** RF-10, RF-11, RF-12, RF-14, RF-18.

**Precondiciones:** El actor está autenticado y posee permisos sobre el recurso.

**Flujo principal:**
1. El actor crea o modifica horarios, bloqueos, médicos, consultorios, especialidades, coberturas o asignaciones.
2. La aplicación valida rangos horarios, referencias, unicidad, actividad del consultorio y ausencia de incompatibilidades con turnos existentes.
3. Persiste los cambios y registra la operación administrativa con actor, entidad, acción y valores pertinentes.
4. Los nuevos bloqueos y asignaciones se consideran en cálculos posteriores de disponibilidad.

**Alternativas:** Si el cambio deja turnos confirmados incompatibles, se rechaza o requiere un flujo explícito de resolución; no se cancelan turnos silenciosamente.

**Postcondición:** Catálogos y agenda quedan actualizados y auditables.

## Historias de Usuario

Los criterios de aceptación son verificables y complementan las reglas de negocio de la especificación.

| ID | Historia | Requerimientos | Criterios de aceptación |
| :--- | :--- | :--- | :--- |
| **HU-01** | Como paciente, quiero crear una cuenta con mis datos para reservar turnos. | RF-01 | Email y DNI duplicados se rechazan; la contraseña queda protegida; el perfil se crea asociado al usuario. |
| **HU-02** | Como usuario, quiero iniciar sesión y acceder según mi rol para usar solo funciones autorizadas. | RF-02, RF-03 | Credenciales inválidas no crean sesión; rutas privadas requieren autenticación; un rol no accede a funciones ajenas. |
| **HU-03** | Como paciente, quiero filtrar profesionales y horarios por especialidad, cobertura y fecha para encontrar una opción adecuada. | RF-04, RF-05, RF-06 | Solo se ofrecen coberturas compatibles; se excluyen bloqueos y turnos ocupados; si no hay resultados se informa claramente. |
| **HU-04** | Como paciente, quiero reservar una franja disponible para confirmar mi consulta. | RF-07 | Se revalida disponibilidad al confirmar; turnos superpuestos para médico o consultorio no se aceptan; se respetan anticipación y límite de turnos activos. |
| **HU-05** | Como paciente, quiero cancelar un turno permitido para liberar el horario si ya no puedo asistir. | RF-08 | Se valida la ventana de cancelación; cancelar conserva el turno y libera disponibilidad en una operación atómica; queda un evento de auditoría. |
| **HU-06** | Como paciente o recepcionista autorizado, quiero reprogramar un turno sin perder su historial. | RF-16, RF-17 | Si el destino no está libre, el turno original no cambia; si se confirma, el anterior queda `REPROGRAMADO` y se crea su sucesor en una transacción. |
| **HU-07** | Como paciente, quiero consultar mis turnos actuales y anteriores para conocer su estado. | RF-08, RF-16, RF-17 | Se muestran estados y consultorio; turnos cancelados y reprogramados siguen disponibles en el historial. |
| **HU-08** | Como médico, quiero consultar mi agenda por día y semana para organizar la atención. | RF-09 | La agenda es cronológica e incluye consultorio y estado; el médico solo consulta información permitida. |
| **HU-09** | Como médico o administrador autorizado, quiero configurar horarios y bloqueos para reflejar la disponibilidad real. | RF-10, RF-11 | Los horarios se validan en formato y rango; los bloqueos excluyen franjas; cambios incompatibles con reservas existentes no se aplican silenciosamente. |
| **HU-10** | Como administrador, quiero administrar médicos y consultorios por separado para mantener actualizado el espacio físico. | RF-14 | Consultorios tienen código único y baja lógica; asignaciones médico-consultorio son explícitas; consultorios inactivos no reciben nuevos turnos. |
| **HU-11** | Como administrador, quiero vincular profesionales con coberturas y aranceles para publicar opciones correctas. | RF-04, RF-12 | La asociación médico-cobertura evita duplicados; disponibilidad y reserva respetan la cobertura activa. |
| **HU-12** | Como recepcionista, quiero reservar por DNI para asistir a pacientes que usan el canal presencial o telefónico. | RF-07, RF-13 | Se identifica al paciente; se validan los mismos conflictos que en la reserva en línea; la operación registra actor y origen. |
| **HU-13** | Como médico o recepcionista autorizado, quiero registrar si el paciente asistió o fue atendido para cerrar la agenda. | RF-09, RF-17 | Solo se modifican turnos elegibles; `ATENDIDO` y `AUSENTE` quedan registrados y no vuelven a ocupar disponibilidad futura. |
| **HU-14** | Como paciente, quiero recibir una confirmación después de reservar para tener constancia de la cita. | RF-15 | El aviso solo se solicita después de confirmar la transacción; una reserva fallida no genera confirmación. |
| **HU-15** | Como administrador, quiero auditar cambios de turnos y catálogos para conocer quién realizó cada operación. | RF-16, RF-18 | Los eventos registran actor cuando existe, fecha, acción y entidad; no contienen contraseñas, tokens ni secretos. |
