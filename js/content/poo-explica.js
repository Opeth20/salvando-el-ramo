import { explica } from './helpers.js';

// "Explícalo con tus palabras": se agrega al final del nivel indicado.
// Las ideas se buscan en el texto en minúsculas y sin tildes, así que los patrones van sin tildes.

export const EXPLICA = {
  'poo-u1-l2': explica('¿Por qué `7 / 2` da `3` en Java y qué harías para obtener `3.5`?', {
    ideas: [
      [/entero|int\b/, 'Los dos números son int (enteros)'],
      [/decimal|pierde|trunca|corta|quita|redonde|elimina/, 'Por eso se pierden los decimales'],
      [/double|7\.0|2\.0|\(double\)|cast|float/, 'Para 3.5 hay que usar un decimal: 7.0 / 2 o (double)'],
    ],
    model: 'Como `7` y `2` son **int**, Java hace división entera y **corta los decimales**: queda 3. Para obtener 3.5 al menos uno debe ser decimal: `7.0 / 2` o `(double) 7 / 2`.',
  }),
  'poo-u2-l1': explica('Explica la diferencia entre **clase** y **objeto** con un ejemplo que **no** sea un perro.', {
    ideas: [
      [/molde|plano|plantilla|receta|modelo|define|describe|tipo/, 'La clase es el molde o plano'],
      [/instancia|concret|especific|real|creado|new|existe/, 'El objeto es algo concreto creado con new'],
      [/varios|muchos|cada uno|distintos|diferentes|mas de un/, 'De una clase salen muchos objetos'],
    ],
    min: 2,
    model: 'La **clase** es el molde: dice qué datos y acciones tendrá algo (por ejemplo `Celular`: marca, batería, llamar()). Un **objeto** es un celular concreto creado con `new`, con sus propios valores. Con una misma clase creo **muchos objetos** distintos.',
  }),
  'poo-u2-l2': explica('¿Para qué sirve el **constructor** y por qué se escribe `this.nombre = nombre`?', {
    ideas: [
      [/new|crea|nace|al crear|cuando se crea|instancia/, 'Se ejecuta al crear el objeto con new'],
      [/inicializ|valor(es)? inicial|dato(s)? inicial|asigna|prepar|da valores|guarda|llena/, 'Le da los valores iniciales'],
      [/this.*(atributo|objeto|mismo|propio)|atributo.*parametro|parametro.*atributo|distingu|diferencia/, 'this distingue el atributo del parámetro'],
    ],
    model: 'El constructor se ejecuta **al hacer `new`** y le da **los valores iniciales** al objeto. Como el parámetro y el atributo se llaman igual, `this.nombre` indica **el atributo del objeto** y `nombre` solo es el parámetro que llegó.',
  }),
  'poo-u3-l1': explica('¿Cuándo un método debería ser `void` y cuándo debería **retornar** algo?', {
    ideas: [
      [/void.*(no (devuelve|retorna|entrega|da)|nada)|(no (devuelve|retorna|entrega)|nada).*void/, 'void no devuelve nada'],
      [/return|retorn|devuelv|entreg/, 'Si necesitas el resultado, el método lo retorna'],
      [/reutiliz|guardar|usar(lo)? (despues|en otro)|otra parte|variable|calcul/, 'Retornar permite reutilizar el resultado'],
    ],
    min: 2,
    model: 'Es **void** cuando solo hace algo (imprimir, cambiar un atributo) y **no entrega nada**. Debe **retornar** cuando calcula un resultado que otro va a usar: así lo puedes guardar en una variable y **reutilizarlo** (imprimirlo, sumarlo, mostrarlo en una ventana).',
  }),
  'poo-u3-l3': explica('¿Qué es la **sobrecarga** y por qué no basta con cambiar el tipo de retorno?', {
    ideas: [
      [/mismo nombre|se llaman igual|igual nombre/, 'Varios métodos con el mismo nombre'],
      [/parametro|argumento/, 'Que cambian los parámetros'],
      [/retorno|return|no sabria|ambigu|confund|no puede (elegir|saber|distinguir)/, 'Solo con el retorno Java no sabría cuál usar'],
    ],
    model: 'Sobrecarga es tener **varios métodos con el mismo nombre** pero **distintos parámetros**. Java elige cuál usar mirando los argumentos de la llamada; si solo cambia el **retorno**, la llamada se ve igual y **no podría distinguirlos**, por eso no compila.',
  }),
  'poo-u4-l1': explica('¿Qué es el **encapsulamiento** y por qué los atributos van `private`?', {
    ideas: [
      [/proteg|ocult|segur|control|nadie|resguard|cuid/, 'Proteger / controlar los datos'],
      [/private|privad/, 'Atributos private'],
      [/get|set|metodo/, 'Se accede solo mediante métodos (getters / setters)'],
    ],
    model: 'Encapsular es **proteger los datos** del objeto: los atributos son **private** para que nadie los cambie directo, y solo se consultan o modifican mediante **métodos públicos** (getters y setters), que pueden validar.',
  }),
  'poo-u4-l3': explica('¿Por qué el constructor debe llamar a los **setters** en vez de hacer `this.edad = edad`?', {
    ideas: [
      [/valid|revis|comprueb|controla/, 'Los setters validan el dato'],
      [/salt|sin (revisar|validar|pasar|control)|no (valida|revisa|pasa)|evita|negativ|invalid|malo|incorrect/, 'Con this.x = x se saltaría la validación'],
    ],
    model: 'Porque la **validación** está en el setter. Si el constructor hace `this.edad = edad`, el objeto podría **nacer con datos inválidos** (una edad negativa) **sin pasar por la revisión**.',
  }),
  'poo-u5-l1': explica('Explica la diferencia entre **"es un"** y **"tiene un"** con un ejemplo.', {
    ideas: [
      [/es un.*(hereda|extends|herencia|hija)|(hereda|extends|herencia).*es un/, '"Es un" → herencia (extends)'],
      [/tiene un.*(atributo|composicion|dentro|guarda)|(atributo|composicion).*tiene un/, '"Tiene un" → atributo del otro tipo'],
    ],
    model: '**"Es un"** es herencia: un Perro *es un* Animal → `class Perro extends Animal`. **"Tiene un"** es un atributo: un Auto *tiene un* propietario → `private Persona propietario;`.',
  }),
  'poo-u6-l2': explica('Explica la diferencia entre **sobrecarga** y **sobrescritura**.', {
    ideas: [
      [/sobrecarga.*parametro|parametro.*sobrecarga/, 'Sobrecarga: mismo nombre, distintos parámetros'],
      [/sobre(e)?scri.*(hij|herenc|padre|subclase|misma firma|mismos parametros|redefin|cambia)|(hij|subclase|herenc).*sobre(e)?scri/, 'Sobrescritura: la hija redefine el método heredado'],
      [/override/, 'La sobrescritura se marca con @Override'],
    ],
    min: 2,
    model: '**Sobrecarga**: varios métodos con el mismo nombre y **distintos parámetros** (normalmente en la misma clase). **Sobrescritura**: la **clase hija vuelve a escribir** un método que heredó, con la **misma firma**, y se marca con `@Override`.',
  }),
  'poo-u6-l3': explica('Si escribo `Animal a = new Perro();` y luego `a.hacerSonido();`, ¿qué se ejecuta y por qué?', {
    ideas: [
      [/perro|ladra|guau/, 'Se ejecuta el método de Perro'],
      [/objeto real|tipo real|el objeto|ejecucion|new perro|lo que (es|hay|se creo)|realmente/, 'Manda el objeto real, no el tipo de la variable'],
      [/polimorf/, 'Eso es polimorfismo'],
    ],
    min: 2,
    model: 'Se ejecuta **el método de Perro**. La variable es de tipo Animal, pero **el objeto real es un Perro**, y Java usa la versión del objeto real. Eso es **polimorfismo**.',
  }),
  'poo-u7-l2': explica('¿Cuándo conviene una **clase abstracta** y cuándo una **interfaz**?', {
    ideas: [
      [/abstract.*(comparte|comun|atributo|codigo|padre|familia|es un|base)/, 'Abstracta: base común con atributos y código (es un)'],
      [/interfa.*(contrato|capacidad|puede|metodo|promet|implements|obliga)/, 'Interfaz: contrato de métodos que se promete cumplir'],
      [/(una sola|solo una|solo un|un solo|unica).*(clase|padre|extends)|varias interfaces|multiples|muchas interfaces/, 'Se hereda de una sola clase, pero se implementan varias interfaces'],
    ],
    min: 2,
    model: '**Clase abstracta** cuando varias clases **comparten atributos y código** y son de la misma familia ("es un"). **Interfaz** cuando quieres un **contrato**: métodos que una clase promete tener ("sabe hacer"). Una clase hereda de **una sola** clase pero puede implementar **varias** interfaces.',
  }),
  'poo-u8-l2': explica('En el método `buscar` del Gestor, ¿por qué "No se encontró" va **después** del for y no en un `else` dentro del for?', {
    ideas: [
      [/cada|todos|por cada|repet|varias veces|muchas veces|cada vuelta|cada elemento/, 'Dentro del for se imprimiría por cada elemento que no coincide'],
      [/revis|recorr|termin|despues de (mirar|ver|buscar)|ninguno|toda la lista|al final/, 'Solo después de revisar toda la lista sabes que no está'],
    ],
    model: 'Si va en un `else` dentro del for, se imprimiría **por cada elemento** que no coincide, aunque el buscado esté más adelante. Solo **después de recorrer toda la lista** sin encontrarlo puedes decir que no está.',
  }),
  'poo-u9-l2': explica('Explica qué son **Stage**, **Scene** y los **nodos** en JavaFX (puedes usar una analogía).', {
    ideas: [
      [/stage.*(ventana|teatro|marco)|(ventana|teatro).*stage/, 'Stage = la ventana'],
      [/scene.*(contenido|obra|escena|dentro|muestra)|escena/, 'Scene = el contenido que se muestra'],
      [/nodo.*(label|button|boton|elemento|actor|control|texto)|label|button|boton|controles/, 'Nodos = los elementos (Label, Button, VBox…)'],
    ],
    model: 'El **Stage** es la ventana (el teatro). La **Scene** es el contenido que se muestra en ella (la obra). Los **nodos** son cada elemento: Label, Button, TextField, VBox (los actores y la escenografía).',
  }),
  'poo-u10-l1': explica('Explica el patrón **MVC**: ¿qué hace cada parte?', {
    ideas: [
      [/model.*(dato|informacion|estudiante|clase|guarda)/, 'Modelo = los datos'],
      [/vist.*(ve|pantalla|fxml|interfaz|visual|muestra|diseno)/, 'Vista = lo que se ve (FXML)'],
      [/controlador.*(event|clic|coordin|conecta|respond|une|intermedi|maneja)/, 'Controlador = responde a los eventos y coordina'],
    ],
    model: 'El **Modelo** guarda los **datos** (Estudiante, la lista). La **Vista** es **lo que se ve** (el FXML). El **Controlador** **responde a los clics** y **coordina**: lee la vista, actualiza el modelo y muestra resultados.',
  }),
  'poo-u11-l3': explica('¿Cuál es la diferencia entre el **DAO** y el **Repository**?', {
    ideas: [
      [/dao.*(archivo|json|base de datos|lee|escrib|guarda|carga|acceso|disco)/, 'DAO: lee y escribe en el archivo o la base de datos'],
      [/repositor.*(lista|observable|app|aplicacion|intermedi|coordina|usa el dao|pide)/, 'Repository: maneja la lista de la app y le pide al DAO'],
    ],
    model: 'El **DAO** sabe **leer y escribir** en el origen físico (el archivo JSON o la base de datos). El **Repository** mantiene **la lista que usa la app** (ObservableList) y **le pide al DAO** cargar o guardar.',
  }),
  'poo-u12-l3': explica('¿Por qué se usa `PreparedStatement` en vez de concatenar el SQL con `+`?', {
    ideas: [
      [/inyeccion|injection|ataque|seguridad|segur|trampa|hack/, 'Evita la inyección SQL'],
      [/\?|parametro|set(string|int|double)|casilla|marcador/, 'Usa ? y los setters (setString, setInt…)'],
    ],
    model: 'Porque concatenar permite **SQL injection**: alguien escribe código SQL en el formulario. Con `PreparedStatement` el SQL lleva **?** y los datos entran con `setString`/`setInt`, así **nunca se mezclan con el comando**.',
  }),
  'poo-prueba1-l1': explica('Explica con tus palabras **los pasos del método** para hacer la prueba.', {
    ideas: [
      [/tabla|corchete|enunciado|subray/, 'Leer el enunciado y llenar la tabla de corchetes'],
      [/molde|interfaz|padre|hija|gestor|orden/, 'Escribir los moldes en orden (interfaz → padre → hijas → gestor → main)'],
      [/prob|ejecut|correr|corre|calculo|compar|revis|checklist/, 'Ejecutar y comparar con el cálculo a mano'],
      [/zip|entreg|export|ava|subir/, 'Exportar el ZIP y entregar'],
    ],
    min: 3,
    model: 'Primero leo el enunciado y **lleno la tabla de corchetes**. Después escribo los **moldes en orden**: interfaz, padre, hijas, gestor y main. Luego **ejecuto y comparo** los costos con mi cálculo a mano, reviso el checklist y al final **exporto el ZIP** y lo subo.',
  }),
};
