Prompts:

Prompt 1:

Contexto:
------------
Esta tarea consiste en la implementación de dos endpoints RESTful para gestionar la lista de candidatos en una interfaz tipo kanban.

Objetivo:
------------
Implementar dos endpoints:

1. **GET /positions/:id/candidates**
   - **Funcionalidad:** Retornar todos los candidatos en proceso para una posición específica (usando `positionID`).
   - **Datos en la respuesta:**
     - Nombre completo del candidato (obtenido de la tabla `candidate`).
     - `current_interview_step`: la fase actual del proceso (obtenida de la tabla `application`).
     - Puntuación media del candidato, calculada a partir de los `score` de las entrevistas (tabla `interview`).

2. **PUT /candidates/:id/stage**
   - **Funcionalidad:** Actualizar la etapa actual del proceso de entrevista para un candidato específico.
   - **Requerimientos:**
     - Recibir el nuevo estado o etapa mediante el request.
     - Validar que el candidato existe antes de proceder a la actualización.
     - Manejar errores de manera adecuada (respondiendo con códigos HTTP correspondientes, por ejemplo: 200, 400, 404).

Buenas Prácticas y Principios:
-------------------------------
- **DDD (Domain-Driven Design):** Estructura el código separando claramente las responsabilidades del dominio, la aplicación y la infraestructura.
- **SOLID:** Aplica los principios SOLID para asegurar que el código sea modular, extensible y fácil de mantener.
- **Arquitectura y Separación de Capas:** Separa la lógica de negocio de los controladores utilizando servicios, repositorios u otras capas que faciliten la gestión del dominio.
- **Validación y Sanitización:** Implementa validaciones robustas y sanitiza los datos de entrada para evitar errores y vulnerabilidades.
- **Manejo de Errores:** Utiliza bloques de manejo de excepciones y retorna mensajes de error claros junto con los códigos HTTP apropiados.
- **Testing:** Incluye pruebas unitarias y de integración para cubrir tanto los casos exitosos como los de error.
- **Documentación y Código Limpio:** Comenta el código, usa nombres descriptivos para funciones y variables, y sigue las convenciones del framework que estés utilizando.
- **Reutilización de Código:** Refactoriza funciones comunes (como el cálculo de la puntuación media) en módulos reutilizables.


Prompt 2:

 Ahora que hemos definido e implementado los endpoints siguiendo DDD, SOLID y las buenas prácticas, el siguiente paso es asegurar que el comportamiento de la API es correcto mediante tests de integración.

Instrucciones:
--------------------------
- Añade tests de integración para validar el funcionamiento de los endpoints **GET /positions/:id/candidates** y **PUT /candidates/:id/stage**.
- Utiliza un framework de testing adecuado (por ejemplo, Jest, Mocha, etc.) para estructurar los tests.
- Para el endpoint GET, asegúrate de probar:
  - Que retorna el listado de candidatos con los campos: nombre completo, `current_interview_step` y la puntuación media.
  - Los casos en que la posición no exista o no tenga candidatos, verificando que se manejen correctamente.
- Para el endpoint PUT, valida:
  - La actualización exitosa de la etapa de un candidato.
  - La respuesta adecuada cuando el candidato no existe.
  - La validación y manejo de datos incorrectos.
- Los tests deben simular peticiones HTTP reales y verificar tanto el código de estado como el contenido de la respuesta.
- Considera la posibilidad de utilizar una base de datos en memoria o mocks para aislar los tests del entorno de producción.
- Asegúrate de documentar cada test para clarificar qué caso se está evaluando.

Por favor, genera el código de tests de integración siguiendo estas pautas.
