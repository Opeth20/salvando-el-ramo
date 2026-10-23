// "🧠 Para recordar": una analogía, una frase corta para memorizar y, cuando ayuda, un mini diagrama.
// Se agregan al final de la primera tarjeta de teoría de cada nivel (clave = id del nivel).

const box = (txt, cls = '') => `<span class="dbox ${cls}">${txt}</span>`;
const arrow = (t = '→') => `<span class="darrow">${t}</span>`;
const diagram = (...parts) => `<div class="diagram">${parts.join('')}</div>`;

export const MEMOS = {
  /* ---------- Unidad 1 ---------- */
  'poo-u1-l1': {
    analogy: 'El programa es una casa y **main es la puerta de entrada**: la JVM siempre entra por ahí. Si no hay puerta (o se llama distinto), no entra nadie.',
    remember: '**P**úblico **S**e **V**a **M**ain → `public static void main` ("Por Si Vienes, Main").',
    diagram: diagram(box('▶ Ejecutar'), arrow(), box('JVM busca <b>main</b>'), arrow(), box('línea 1, línea 2…')),
  },
  'poo-u1-l2': {
    analogy: 'Cada tipo es una **caja de distinto tamaño**: `int` guarda enteros, `double` decimales, `boolean` solo sí/no, `String` frases. No puedes meter una frase en una caja de números.',
    remember: '`int / int` **corta** los decimales (7/2 = 3). `%` es **lo que sobra** de la división (7 % 2 = 1).',
    diagram: diagram(box('int<br><b>20</b>'), box('double<br><b>1.75</b>'), box('boolean<br><b>true</b>'), box("char<br><b>'S'</b>"), box('String<br><b>"Ana"</b>')),
  },
  'poo-u1-l3': {
    analogy: 'El Scanner es un **mesero tomando tu pedido**: `nextLine()` anota una frase completa, `nextInt()` un número, `next()` una sola palabra.',
    remember: 'Scanner = **import + new + next…()**. En Windows en español los decimales se escriben con **coma**: `1,65`.',
  },
  'poo-u1-l4': {
    analogy: '`if` es una **bifurcación en el camino**; `switch` es un **ascensor** (eliges el piso); `for` es **dar vueltas a la pista contando**; `while` es **seguir corriendo mientras no suene el pito**.',
    remember: 'Si sabes **cuántas veces** → `for`. Si repites **hasta que pase algo** → `while`. En `switch`, **cada case lleva su break**.',
  },

  /* ---------- Unidad 2 ---------- */
  'poo-u2-l1': {
    analogy: 'La **clase es el plano** de una casa; los **objetos son las casas construidas**. Con un plano construyes muchas casas, cada una con su propio color (sus atributos).',
    remember: '**Atributos = lo que ES / TIENE** (sustantivos). **Métodos = lo que HACE** (verbos).',
    diagram: diagram(box('📐 class Perro<br><small>nombre, peso<br>ladrar()</small>', 'main'), arrow('new →'), box('🐶 firulais'), box('🐕 toby'), box('🐩 max')),
  },
  'poo-u2-l2': {
    analogy: 'El constructor es la **ceremonia de nacimiento** del objeto: se ejecuta una sola vez, al hacer `new`, y le pone nombre y datos iniciales.',
    remember: '`this.nombre = nombre` se lee: **"MI nombre = el nombre que me pasaron"**. El constructor **se llama como la clase y no lleva void**.',
    diagram: diagram(box('new Mascota("Doge", 12.5)'), arrow(), box('constructor<br><small>this.nombre = "Doge"<br>this.peso = 12.5</small>'), arrow(), box('🐕 objeto listo')),
  },
  'poo-u2-l3': {
    analogy: 'Traducir de Python a Java es como **pasar una receta casera a una receta de restaurante**: los mismos pasos, pero escribiendo exactamente cada ingrediente (los tipos).',
    remember: '`__init__` → **constructor** · `self` → **this** · `_algo` → **private** · `print` → **System.out.println**.',
  },

  /* ---------- Unidad 3 ---------- */
  'poo-u3-l1': {
    analogy: 'Un método **void** es mandar a alguien a **botar la basura**: lo hace y no trae nada. Un método con **return** es mandarlo a **comprar pan**: vuelve con algo en la mano.',
    remember: 'Si dice `void`, **no** hay return con valor. Si dice `int`, `double`, `String`… **todos los caminos** terminan en `return`.',
    diagram: diagram(box('sumar(2, 3)'), arrow('llama →'), box('return a + b'), arrow('← entrega'), box('<b>5</b>')),
  },
  'poo-u3-l2': {
    analogy: '**Parámetro** = la casilla vacía de un formulario ("Nombre: ____"). **Argumento** = lo que escribes en ella ("Ana"). **static** = la **pizarra de la sala** (una sola, la comparten todos); lo normal es el **cuaderno de cada alumno** (uno por objeto).',
    remember: 'static → `Clase.metodo()` · normal → `objeto.metodo()`. Java pasa **fotocopias** de los números: cambiar la copia no cambia el original.',
  },
  'poo-u3-l3': {
    analogy: 'Sobrecarga es como un **cajero** que acepta tarjeta, efectivo o QR: el mismo trámite ("pagar") con distintas formas de entregar los datos.',
    remember: 'Sobre**CARGA** = misma clase, mismo nombre, **parámetros distintos**. Cambiar solo el `return` **no** cuenta.',
  },

  /* ---------- Unidad 4 ---------- */
  'poo-u4-l1': {
    analogy: 'Encapsular es como un **cajero automático**: el dinero (los atributos) está en una bóveda **private**; tú solo usas la pantalla y los botones **public**.',
    remember: '**Atributos private, métodos public.** private = solo yo · protected = mi familia · public = todo el mundo.',
    diagram: diagram(box('🔒 private<br><small>saldo</small>', 'lock'), arrow('←'), box('public<br><small>depositar()<br>getSaldo()</small>'), arrow('←'), box('👤 main')),
  },
  'poo-u4-l2': {
    analogy: 'El **getter** es la **ventanilla de consulta** ("¿cuánto tengo?") y el **setter** la **ventanilla de trámites** ("quiero cambiar esto"), donde revisan tus papeles antes de aceptar.',
    remember: '**get** = me **da** (return). **set** = me **cambia** (recibe un parámetro, es void). Nombre: get/set + **Mayúscula**: `edad` → `getEdad` / `setEdad`.',
  },
  'poo-u4-l3': {
    analogy: 'El setter es el **guardia de la puerta**: si el dato viene mal (edad negativa), toca la alarma (`throw`). El `try/catch` es el **bombero** que atiende la alarma para que el edificio no se caiga.',
    remember: 'Constructor → **llama a los setters** (nunca `this.x = x`), así el guardia revisa también al nacer.',
    diagram: diagram(box('setEdad(-5)'), arrow(), box('🚨 if (edad &lt; 0)<br>throw'), arrow(), box('🧯 catch<br><small>"Error: …"</small>')),
  },
  'poo-u4-l4': {
    analogy: 'El UML es el **plano del arquitecto**: no es la casa, pero con él cualquiera la construye igual. Tú solo tienes que **traducir símbolos**.',
    remember: '**−** = private (un candado cerrado) · **+** = public (abierto) · **#** = protected. En UML el tipo va **después**: `edad: int` → `int edad`.',
  },

  /* ---------- Unidad 5 ---------- */
  'poo-u5-l1': {
    analogy: 'Un Auto **tiene un** dueño: no es que el auto sea una persona, sino que **guarda una referencia** a ella, como tener su número en la agenda y poder llamarla.',
    remember: '"**Tiene un**" → atributo del otro tipo (`private Persona propietario;`). Para usarlo: `propietario.saludar()`.',
    diagram: diagram(box('🚗 Auto<br><small>modelo<br>propietario ─┐</small>'), arrow('→'), box('👤 Persona<br><small>nombre, edad</small>')),
  },
  'poo-u5-l2': {
    analogy: 'Una clase reutilizable es como una **calculadora**: te da el resultado y tú decides si lo anotas, lo dices o lo guardas. No te obliga a imprimirlo.',
    remember: '**Calcula y retorna en la clase; imprime en el main.**',
  },
  'poo-u5-l3': {
    analogy: 'La bencinera tiene 3 trabajadores: **Combustible** sabe los precios, **Venta** hace la cuenta y **Pago** da el vuelto. Cada uno su tarea.',
    remember: 'Lee el enunciado y subraya: **sustantivos → clases/atributos**, **verbos → métodos**, **"debe ser mayor a…" → validación**.',
  },

  /* ---------- Unidad 6 ---------- */
  'poo-u6-l1': {
    analogy: 'Herencia es **familia**: el hijo recibe el apellido y las costumbres del papá (atributos y métodos) y además tiene lo suyo. `super(...)` es **saludar primero a papá**: siempre la primera línea.',
    remember: 'Prueba de la frase: "¿Un ___ **ES UN** ___?" Si suena bien → `extends`. Si suena "**TIENE UN**" → atributo.',
    diagram: diagram(box('🐾 Animal<br><small>nombre, sonido</small>', 'main'), arrow('▷ extends'), box('🐶 Perro<br><small>+ raza</small>'), box('🐱 Gato<br><small>+ color</small>')),
  },
  'poo-u6-l2': {
    analogy: 'Sobrescribir es **heredar la receta de la abuela y cambiarle un ingrediente**: el plato se llama igual, pero en tu casa sabe distinto.',
    remember: 'Sobre**ESCRITURA** = **RE-escribo** lo del papá (misma firma, en la hija, con `@Override`). Sobre**CARGA** = **CARGO** otros parámetros.',
  },
  'poo-u6-l3': {
    analogy: 'Polimorfismo es un **control remoto universal**: aprietas "encender" y la tele, la radio o el aire responden cada uno a su manera.',
    remember: '`Animal a = new Perro();` → la **variable** es del papá, pero **el que habla es el hijo**: se ejecuta el método del objeto real.',
    diagram: diagram(box('Animal a'), arrow('apunta a →'), box('🐶 new Perro()'), arrow('a.hacerSonido() →'), box('"Guau"')),
  },

  /* ---------- Unidad 7 ---------- */
  'poo-u7-l1': {
    analogy: 'Nadie compra "un vehículo" en la automotora: compras **un auto** o **un camión**. "Vehículo" es una **idea general** → clase **abstracta**: no se puede hacer `new`.',
    remember: 'Método abstracto = **"cada hijo lo hace a su manera"**: sin cuerpo y termina en `;`. Las hijas **deben** completarlo.',
  },
  'poo-u7-l2': {
    analogy: 'Una interfaz es un **enchufe estándar**: no le importa si eres un secador o un cargador; si tienes la forma correcta (sus métodos), te puedes conectar.',
    remember: 'Clase abstracta = **"qué ERES"** (un solo papá con `extends`). Interfaz = **"qué SABES HACER"** (varias con `implements`).',
    diagram: diagram(box('🔌 interface Revisable<br><small>estaDisponible…()<br>marcar…()</small>', 'main'), arrow('implements'), box('🚗 Auto ✔'), box('🚚 Camion ✘')),
  },
  'poo-u7-l3': {
    analogy: 'El molde de la prueba es una **plantilla de formulario**: los espacios en [CORCHETES] cambian, el resto se copia igual siempre.',
    remember: 'Orden **I-P-H-G-M**: **I**nterfaz, **P**adre, **H**ijas, **G**estor, **M**ain ("**I**ba **P**ara **H**acer **G**ol en el **M**inuto 90").',
  },

  /* ---------- Unidad 8 ---------- */
  'poo-u8-l1': {
    analogy: 'Un ArrayList es una **mochila que se agranda sola**: `add` mete algo, `get(0)` saca lo del primer bolsillo, `size()` cuenta cuántas cosas hay.',
    remember: 'Las posiciones **parten en 0**. `for (Tipo x : lista)` se lee **"por cada x en la lista"**.',
    diagram: diagram(box('[0] "Ana"'), box('[1] "Luis"'), box('[2] "Sofía"'), arrow('size() = 3')),
  },
  'poo-u8-l2': {
    analogy: 'El Gestor es la **recepcionista del gimnasio** con su cuaderno: anota a cada socio (registrar), lo busca por su número (buscar) y lee la lista completa (listar).',
    remember: 'En **buscar**: si lo encuentras, `return` **adentro** del for. Si terminaste de mirar **todos** y no estaba, recién ahí "No se encontró" (**afuera** del for).',
  },
  'poo-u8-l3': {
    analogy: 'El main es el **director de orquesta**: no toca ningún instrumento, solo indica quién entra y en qué orden.',
    remember: 'Main de la prueba = **crear gestor → crear objetos de la tabla → registrar → buscar uno que SÍ y uno que NO → listar → costos**.',
  },

  /* ---------- Unidad 9 ---------- */
  'poo-u9-l1': {
    analogy: 'Maven es un **delivery de librerías**: escribes el pedido en `pom.xml` (qué y qué versión) y él lo descarga y lo deja listo.',
    remember: 'Código Java en `src/main/java` · ventanas y estilos en `src/main/resources` · el pedido en `pom.xml`.',
  },
  'poo-u9-l2': {
    analogy: 'JavaFX es un **teatro**: el **Stage** es el teatro (la ventana), la **Scene** es la obra que se presenta y los **nodos** son los actores y la escenografía.',
    remember: 'Stage **⊃** Scene **⊃** nodos. Sin `setScene` el teatro está vacío; sin `show()` las cortinas siguen cerradas.',
    diagram: `<div class="nest"><span>🪟 Stage (ventana)</span><div class="nest"><span>🎬 Scene</span><div class="nest"><span>📦 VBox</span><div class="row"><span class="dbox">Label</span><span class="dbox">Button</span></div></div></div></div>`,
  },
  'poo-u9-l3': {
    analogy: 'Como un **día de clases**: `init()` es preparar la mochila en la casa, `start()` es entrar a la sala y empezar, `stop()` es ordenar antes de irte.',
    remember: '**I-S-S**: Init → Start → Stop. Siempre en ese orden, sin importar cómo los escribas.',
  },
  'poo-u9-l4': {
    analogy: 'El FXML es la **maqueta** de la pantalla: dice dónde va cada cosa, pero no qué hace. Lo que hace (los clics) lo programa el controlador.',
    remember: '`VBox` = **V**ertical (uno bajo otro) · `HBox` = **H**orizontal (uno al lado del otro).',
  },

  /* ---------- Unidad 10 ---------- */
  'poo-u10-l1': {
    analogy: 'MVC es un **restaurante**: la **Vista** es el comedor y los platos (lo que ves), el **Controlador** es el mesero (lleva y trae pedidos) y el **Modelo** es la cocina y la despensa (los datos).',
    remember: 'El cliente **nunca entra a la cocina**: la vista no toca los datos directo, siempre pasa por el controlador.',
    diagram: diagram(box('🍽️ Vista<br><small>FXML</small>'), arrow('⇄'), box('🧑‍🍳 Controlador<br><small>@FXML</small>', 'main'), arrow('⇄'), box('🥫 Modelo<br><small>Estudiante, lista</small>')),
  },
  'poo-u10-l2': {
    analogy: 'La ObservableList es una **lista chismosa**: apenas alguien agrega o borra algo, le cuenta a la tabla, y la tabla se actualiza sola.',
    remember: 'Columna → `PropertyValueFactory<>("nombre")` busca **getNombre()**. Tabla → `setItems(lista)`. Sin eso: tabla vacía.',
  },
  'poo-u10-l3': {
    analogy: 'Validar es el **control de seguridad del aeropuerto**: revisas cada cosa en orden y, al primer problema, **no pasa** (`return`).',
    remember: '**trim → isEmpty → contains("@") → parseInt en try/catch → recién guardar.**',
  },
  'poo-u10-l4': {
    analogy: 'Cada control tiene su **pregunta**: al TextField le preguntas "¿qué escribieron?" (`getText`), al CheckBox "¿estás marcado?" (`isSelected`), al ComboBox "¿qué eligieron?" (`getValue`).',
    remember: 'Binding = **amarrar con un hilo**: lo que cambia en uno aparece en el otro sin escribir código extra.',
  },
  'poo-u10-l5': {
    analogy: 'AppNavigator es el **control remoto del televisor**: cualquier controlador lo usa para cambiar de canal (de vista) sin saber cómo funciona por dentro.',
    remember: 'Al inicio: `setStage(stage)`. Para cambiar: `showView("archivo.fxml", "Título")`.',
  },

  /* ---------- Unidad 11 ---------- */
  'poo-u11-l1': {
    analogy: 'JSON es la **maleta** de tus objetos: **serializar** es hacer la maleta (objeto → texto) y **deserializar** es deshacerla al llegar (texto → objeto).',
    remember: '**write**Value = guardar (escribir). **read**Value = cargar (leer). Jackson necesita **constructor vacío** para "armar" el objeto al desempacar.',
    diagram: diagram(box('🧑 Estudiante'), arrow('writeValue →'), box('🧳 {"nombre": "Ana"}'), arrow('→ readValue'), box('🧑 Estudiante')),
  },
  'poo-u11-l2': {
    analogy: 'El DAO es el **bodeguero**: sabe exactamente en qué estante (archivo o base de datos) está cada caja. Nadie más entra a la bodega.',
    remember: 'Interfaz DAO = **qué** se puede hacer (cargar, guardar). JsonDao = **cómo** se hace con archivos.',
  },
  'poo-u11-l3': {
    analogy: 'El Repository es el **encargado de la tienda**: tiene los productos en la vitrina (la ObservableList) y, cuando falta algo, le pide al bodeguero (DAO).',
    remember: 'Controlador → Repository → DAO → archivo. **Cada uno habla solo con el de al lado.**',
    diagram: diagram(box('🖱️ Controller'), arrow(), box('🏪 Repository<br><small>ObservableList</small>'), arrow(), box('📦 DAO'), arrow(), box('📄 .json')),
  },
  'poo-u11-l4': {
    analogy: 'El FileChooser es la ventanita de **"Guardar como"** de Word. Si el usuario aprieta Cancelar, no hay archivo: `null`.',
    remember: 'Después de un diálogo, **siempre** pregunta `if (archivo != null)`.',
  },

  /* ---------- Unidad 12 ---------- */
  'poo-u12-l1': {
    analogy: 'JDBC es un **teléfono** entre Java y MySQL: marcas el número (la URL), te identificas (usuario y clave) y conversas. Al terminar, **cuelgas** (try-with-resources lo hace solo).',
    remember: 'URL = `jdbc:mysql://` + **dónde** (localhost:3306) + **qué base** (/tienda_fx).',
  },
  'poo-u12-l2': {
    analogy: 'El ResultSet es una **fila de personas esperando**: `rs.next()` hace pasar a la siguiente y le preguntas sus datos (`getString("nombre")`).',
    remember: '**SELECT → executeQuery → ResultSet**. Los otros (INSERT/UPDATE/DELETE) → **executeUpdate**.',
  },
  'poo-u12-l3': {
    analogy: 'Concatenar SQL es **escribir una carta a mano** con lo que te dictan (alguien te puede dictar una trampa). PreparedStatement es un **formulario con casillas** (?): lo que escriban queda dentro de la casilla y no puede cambiar la carta.',
    remember: 'Los **?** se cuentan **desde 1**: el primer ? es `setX(1, …)`.',
  },

  /* ---------- Prueba 1 ---------- */
  'poo-prueba1-l1': {
    analogy: 'La prueba es como **armar un mueble de IKEA**: si sigues el instructivo (la tabla y los moldes en orden), siempre queda. Si improvisas, sobran tornillos.',
    remember: '**Leer → Tabla → Moldes I-P-H-G-M → Probar → ZIP.** 10 minutos con lápiz te ahorran 30 de errores.',
  },
};
