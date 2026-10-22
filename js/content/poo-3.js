import { c, teoria, fill, line, write, fix, out, level, unit } from './helpers.js';

// Unidades 9–12: Maven + JavaFX, MVC, persistencia JSON, JDBC con MySQL.
export default [
  /* ======================= UNIDAD 9 ======================= */
  unit('Maven y JavaFX', 'pom.xml, Stage, Scene, nodos y ciclo de vida', 'purple', [
    level('Maven y pom.xml', '📦', [
      teoria('¿Qué es Maven?',
        '**Maven** gestiona el proyecto: descarga librerías (dependencias), compila y ejecuta. Todo se configura en **pom.xml**.',
        c(`<dependencies>
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-controls</artifactId>
        <version>\${javafx.version}</version>
    </dependency>
    <dependency>
        <groupId>org.openjfx</groupId>
        <artifactId>javafx-fxml</artifactId>
        <version>\${javafx.version}</version>
    </dependency>
</dependencies>`, 'xml'),
        `<table><tr><th>Ubicación</th><th>Contiene</th></tr>
<tr><td>\`src/main/java\`</td><td>Clases Java</td></tr>
<tr><td>\`src/main/resources\`</td><td>FXML, CSS, imágenes</td></tr>
<tr><td>\`pom.xml\`</td><td>Dependencias y plugins</td></tr></table>
<div class="tip">▶️ Ejecutar desde consola: \`mvn clean javafx:run\`</div>`),
      fill('Completa la dependencia de controles JavaFX.',
        `<dependency>
    <[[groupId]]>org.openjfx</groupId>
    <artifactId>[[javafx-controls]]</artifactId>
    <[[version]]>\${javafx.version}</version>
</dependency>`, { lang: 'xml' }),
      fill('¿Dónde va cada archivo?',
        `// Las clases .java van en:     src/main/[[java]]
// Los .fxml y .css van en:       src/main/[[resources]]
// Las dependencias se declaran:  [[pom.xml]]`),
      line('Escribe el comando Maven que limpia y ejecuta una aplicación JavaFX.', {
        checks: [['mvn clean javafx:run', 'mvn clean javafx:run']],
        solution: 'mvn clean javafx:run',
        lang: 'text',
      }),
      write('Escribe la dependencia de **javafx-fxml** (groupId `org.openjfx`, versión `21.0.2`).', {
        lang: 'xml',
        starter: '',
        checks: [
          ['<dependency>', 'Abre <dependency>'],
          ['<groupId>org.openjfx</groupId>', '<groupId>org.openjfx</groupId>'],
          ['<artifactId>javafx-fxml</artifactId>', '<artifactId>javafx-fxml</artifactId>'],
          ['<version>21.0.2</version>', '<version>21.0.2</version>'],
          ['</dependency>', 'Cierra </dependency>'],
        ],
        solution: `<dependency>
    <groupId>org.openjfx</groupId>
    <artifactId>javafx-fxml</artifactId>
    <version>21.0.2</version>
</dependency>`,
      }),
    ]),

    level('Stage, Scene y nodos', '🪟', [
      teoria('Tu primera ventana',
        '**Stage** = la ventana. **Scene** = el contenido. **Nodos** = los elementos (Label, Button, VBox...).',
        c(`public class HelloApplication extends Application {
    @Override
    public void start(Stage primaryStage) {
        Label titulo = new Label("Hola JavaFX con Maven");
        Button boton = new Button("Haz clic aquí");
        boton.setOnAction(e -> titulo.setText("La escena está funcionando"));

        VBox root = new VBox(15, titulo, boton);   // 15 = espacio entre nodos
        root.setAlignment(Pos.CENTER);

        Scene scene = new Scene(root, 500, 300);
        primaryStage.setTitle("Mi primer proyecto JavaFX");
        primaryStage.setScene(scene);
        primaryStage.show();
    }

    public static void main(String[] args) {
        launch(args);
    }
}`),
        '<div class="tip">🪆 Stage ⊃ Scene ⊃ nodos (árbol visual).</div>'),
      fill('Completa la aplicación.',
        `public class HelloApplication [[extends]] Application {
    @Override
    public void [[start]](Stage primaryStage) {
        VBox root = new VBox(15);
        Scene scene = new [[Scene]](root, 500, 300);
        primaryStage.[[setScene]](scene);
        primaryStage.[[show]]();
    }

    public static void main(String[] args) {
        [[launch]](args);
    }
}`),
      write('Dentro de `start`: crea un `Label titulo` con texto `Hola JavaFX`, un `Button boton` con texto `Clic`, y un `VBox root` con espaciado 15 que contenga ambos.', {
        starter: '',
        checks: [
          ['Label titulo=new Label("Hola JavaFX");', 'Label titulo = new Label("Hola JavaFX");'],
          ['Button boton=new Button("Clic");', 'Button boton = new Button("Clic");'],
          ['VBox root=new VBox(15,titulo,boton);', 'VBox root = new VBox(15, titulo, boton);'],
        ],
        solution: `Label titulo = new Label("Hola JavaFX");
Button boton = new Button("Clic");
VBox root = new VBox(15, titulo, boton);`,
      }),
      line('Haz que al presionar `boton` el `titulo` cambie su texto a `Funciona` (usa una lambda).', {
        checks: [[/boton\.setOnAction\(\(?\w+\)?->titulo\.setText\("Funciona"\)\);/, 'boton.setOnAction(e -> titulo.setText("Funciona"));']],
        solution: 'boton.setOnAction(e -> titulo.setText("Funciona"));',
      }),
      fix('La ventana se abre vacía. Falta conectar la escena al Stage. Corrígelo.', {
        starter: `@Override
public void start(Stage primaryStage) {
    Label titulo = new Label("Hola");
    Scene scene = new Scene(new VBox(titulo), 400, 200);
    primaryStage.show();
}`,
        checks: [
          ['primaryStage.setScene(scene);', 'primaryStage.setScene(scene);'],
          [/setScene\(scene\);primaryStage\.show\(\);/, 'setScene debe ir antes de show()'],
        ],
        solution: `@Override
public void start(Stage primaryStage) {
    Label titulo = new Label("Hola");
    Scene scene = new Scene(new VBox(titulo), 400, 200);
    primaryStage.setScene(scene);
    primaryStage.show();
}`,
      }),
    ]),

    level('Ciclo de vida', '🔄', [
      teoria('init → start → stop',
        `<table><tr><th>Método</th><th>Cuándo</th><th>Para qué</th></tr>
<tr><td>\`init()\`</td><td>Antes de mostrar la interfaz</td><td>Preparar datos y configuración</td></tr>
<tr><td>\`start(Stage)\`</td><td>Al comenzar visualmente</td><td>Crear escena y mostrar ventana</td></tr>
<tr><td>\`stop()\`</td><td>Antes de cerrar</td><td>Liberar recursos, guardar, cerrar conexiones</td></tr></table>`,
        '<div class="tip">Orden: se crea la instancia → `init()` → `start()` → (usuario cierra) → `stop()`</div>'),
      out('El usuario abre la app y luego cierra la ventana. ¿Qué se imprime en consola?',
        `public class App extends Application {
    @Override
    public void stop() {
        System.out.println("stop");
    }

    @Override
    public void start(Stage stage) {
        System.out.println("start");
        stage.setScene(new Scene(new VBox(), 400, 200));
        stage.show();
    }

    @Override
    public void init() {
        System.out.println("init");
    }
}`,
        'init\nstart\nstop', { explain: 'No importa el orden en que los escribas: JavaFX siempre llama init, start y stop en ese orden.', skipVerify: true }),
      fill('Completa los nombres de los métodos del ciclo de vida.',
        `@Override
public void [[init]]() {
    System.out.println("Preparando datos...");
}

@Override
public void [[start]](Stage primaryStage) {
    primaryStage.show();
}

@Override
public void [[stop]]() {
    System.out.println("Liberando recursos...");
}`),
      write('Sobrescribe `stop()` para que imprima `Guardando datos...` antes de cerrar.', {
        starter: '',
        checks: [
          ['@Override', 'Usa @Override'],
          ['public void stop(){', 'public void stop()'],
          ['System.out.println("Guardando datos...");', 'Imprime "Guardando datos..."'],
        ],
        solution: `@Override
public void stop() {
    System.out.println("Guardando datos...");
}`,
      }),
    ]),

    level('Ventana en FXML', '🖼️', [
      teoria('Armar la vista en hello-view.fxml (Guía 2.1.5)',
        'El proyecto JavaFX de IntelliJ trae 3 archivos clave: **HelloApplication.java** (arranca), **HelloController.java** (eventos) y **hello-view.fxml** (la vista).',
        c(`<VBox alignment="CENTER" spacing="12.0"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.example.ejerciciojavafx.HelloController">
    <padding>
        <Insets top="20" right="20" bottom="20" left="20"/>
    </padding>
    <Label text="Registro básico de usuario" style="-fx-font-size: 22px;"/>
    <Label text="Complete los siguientes datos"/>
    <TextField promptText="Ingrese su nombre" maxWidth="240"/>
    <CheckBox text="Acepto continuar con el ejercicio"/>
    <HBox alignment="CENTER" spacing="10.0">
        <Button text="Guardar"/>
        <Button text="Limpiar"/>
    </HBox>
</VBox>`, 'xml'),
        c(`// HelloApplication.java: carga el FXML
FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.getResource("hello-view.fxml"));
Scene scene = new Scene(fxmlLoader.load(), 640, 420);
stage.setScene(scene);
stage.show();`),
        `<ul><li>\`VBox\`: apila en vertical · \`HBox\`: en horizontal · \`spacing\`: separación.</li>
<li>\`promptText\`: texto guía gris dentro del TextField.</li>
<li>\`fx:controller\` debe tener el **paquete + clase exactos** del controlador.</li></ul>`),
      fill('Completa la vista.',
        `<VBox alignment="[[CENTER]]" spacing="12.0">
    <Label text="Registro básico de usuario"/>
    <TextField [[promptText]]="Ingrese su nombre"/>
    <[[CheckBox]] text="Acepto continuar con el ejercicio"/>
    <[[HBox]] alignment="CENTER" spacing="10.0">
        <[[Button]] text="Guardar"/>
    </HBox>
</VBox>`, { lang: 'xml' }),
      line('Escribe el `Label` cuyo texto sea `Complete los siguientes datos`.', {
        lang: 'xml',
        checks: [[/^<Label text="Complete los siguientes datos"( [\w-]+="[^"]*")*\/>$/, '<Label text="Complete los siguientes datos"/>']],
        solution: '<Label text="Complete los siguientes datos"/>',
      }),
      write('Escribe un `HBox` centrado con `spacing="10.0"` que contenga dos botones: `Guardar` y `Limpiar`.', {
        lang: 'xml',
        starter: '',
        checks: [
          [/<HBox( [\w-]+="[^"]*")*>/, 'Abre <HBox ...>'],
          ['alignment="CENTER"', 'alignment="CENTER"'],
          ['spacing="10.0"', 'spacing="10.0"'],
          [/<Button text="Guardar"( [\w-]+="[^"]*")*\/>/, '<Button text="Guardar"/>'],
          [/<Button text="Limpiar"( [\w-]+="[^"]*")*\/>/, '<Button text="Limpiar"/>'],
          ['</HBox>', 'Cierra </HBox>'],
        ],
        solution: `<HBox alignment="CENTER" spacing="10.0">
    <Button text="Guardar"/>
    <Button text="Limpiar"/>
</HBox>`,
      }),
      fill('Así `HelloApplication` carga la vista.',
        `FXMLLoader fxmlLoader = new FXMLLoader(HelloApplication.class.[[getResource]]("[[hello-view.fxml]]"));
Scene scene = new Scene(fxmlLoader.[[load]](), 640, 420);`),
      fix('Error: "ClassNotFoundException: com.example.demo.HelloController". El paquete real es `com.example.ejerciciojavafx`. Corrige el FXML.', {
        lang: 'xml',
        starter: `<VBox alignment="CENTER" spacing="12.0"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.example.demo.HelloController">
    <Label text="Hola"/>
</VBox>`,
        checks: [['fx:controller="com.example.ejerciciojavafx.HelloController"', 'fx:controller="com.example.ejerciciojavafx.HelloController"']],
        solution: `<VBox alignment="CENTER" spacing="12.0"
      xmlns:fx="http://javafx.com/fxml/1"
      fx:controller="com.example.ejerciciojavafx.HelloController">
    <Label text="Hola"/>
</VBox>`,
      }),
    ]),
  ]),

  /* ======================= UNIDAD 10 ======================= */
  unit('Patrón MVC en JavaFX', 'FXML, controladores, TableView, ObservableList y validación', 'green', [
    level('Model · View · Controller', '🧩', [
      teoria('Separar responsabilidades',
        `<table><tr><th>Capa</th><th>Ejemplo</th><th>Responsabilidad</th></tr>
<tr><td>Model</td><td>\`Estudiante\`, \`EstudianteRepository\`</td><td>Datos y reglas</td></tr>
<tr><td>View</td><td>\`lista-view.fxml\`</td><td>Cómo se ve</td></tr>
<tr><td>Controller</td><td>\`ListaController\`</td><td>Responde a eventos y coordina</td></tr></table>`,
        c(`<GridPane fx:controller="org.example.controller.FormController"
          xmlns:fx="http://javafx.com/fxml">
    <TextField fx:id="txtNombre"/>
    <Button text="Guardar" onAction="#guardarEstudiante"/>
</GridPane>`, 'xml'),
        c(`public class FormController {
    @FXML private TextField txtNombre;      // mismo nombre que el fx:id

    @FXML
    private void guardarEstudiante() {       // mismo nombre que onAction="#..."
        String nombre = txtNombre.getText().trim();
    }
}`)),
      fill('Conecta la vista con el controlador.',
        `<TextField [[fx:id]]="txtNombre"/>
<Button text="Guardar" onAction="[[#guardarEstudiante]]"/>`, { lang: 'xml' }),
      fill('Y el lado del controlador.',
        `public class FormController {
    [[@FXML]] private [[TextField]] txtNombre;

    @FXML
    private void [[guardarEstudiante]]() {
        System.out.println(txtNombre.[[getText]]());
    }
}`),
      line('Lee el texto de `txtNombre` sin espacios al inicio ni al final y guárdalo en `String nombre`.', {
        checks: [['String nombre=txtNombre.getText().trim();', 'String nombre = txtNombre.getText().trim();']],
        solution: 'String nombre = txtNombre.getText().trim();',
      }),
      fix('El FXML tiene `fx:id="txtCorreo"` pero el campo queda null. Corrige el controlador.', {
        starter: `public class FormController {
    @FXML private TextField txtNombre;
    @FXML private TextField txtEmail;
}`,
        checks: [
          ['@FXML private TextField txtCorreo;', '@FXML private TextField txtCorreo;'],
          { not: 'txtEmail', label: 'El nombre debe coincidir exactamente con el fx:id' },
        ],
        solution: `public class FormController {
    @FXML private TextField txtNombre;
    @FXML private TextField txtCorreo;
}`,
      }),
    ]),

    level('TableView y ObservableList', '📊', [
      teoria('Tablas que se actualizan solas',
        'Una `TableView` enlazada a una `ObservableList` **se refresca automáticamente** cuando la lista cambia.',
        c(`public class ListaController {
    @FXML private TableView<Estudiante> tablaEstudiantes;
    @FXML private TableColumn<Estudiante, Integer> colId;
    @FXML private TableColumn<Estudiante, String> colNombre;

    private ObservableList<Estudiante> estudiantes =
            FXCollections.observableArrayList();

    @FXML
    public void initialize() {
        colId.setCellValueFactory(new PropertyValueFactory<>("id"));
        colNombre.setCellValueFactory(new PropertyValueFactory<>("nombre"));
        tablaEstudiantes.setItems(estudiantes);
    }
}`),
        '<div class="warn">⚠️ `PropertyValueFactory<>("nombre")` busca el método `getNombre()`. Si el texto no coincide, la columna sale vacía.</div>'),
      fill('Completa la configuración de la tabla.',
        `ObservableList<Estudiante> estudiantes = FXCollections.[[observableArrayList]]();

colNombre.setCellValueFactory(new [[PropertyValueFactory]]<>("nombre"));
tablaEstudiantes.[[setItems]](estudiantes);`),
      write('Escribe `initialize()` configurando `colId` con la propiedad `"id"`, `colEdad` con `"edad"` y enlaza `tablaEstudiantes` con `estudiantes`.', {
        starter: '',
        checks: [
          ['public void initialize(){', 'public void initialize()'],
          ['colId.setCellValueFactory(new PropertyValueFactory<>("id"));', 'colId con PropertyValueFactory<>("id")'],
          ['colEdad.setCellValueFactory(new PropertyValueFactory<>("edad"));', 'colEdad con PropertyValueFactory<>("edad")'],
          ['tablaEstudiantes.setItems(estudiantes);', 'tablaEstudiantes.setItems(estudiantes);'],
        ],
        solution: `@FXML
public void initialize() {
    colId.setCellValueFactory(new PropertyValueFactory<>("id"));
    colEdad.setCellValueFactory(new PropertyValueFactory<>("edad"));
    tablaEstudiantes.setItems(estudiantes);
}`,
      }),
      fix('La columna Nombre aparece vacía. El getter del modelo es `getNombre()`. Corrige la propiedad.', {
        starter: `colNombre.setCellValueFactory(new PropertyValueFactory<>("Nombre_estudiante"));`,
        checks: [['colNombre.setCellValueFactory(new PropertyValueFactory<>("nombre"));', 'La propiedad debe ser "nombre"']],
        solution: `colNombre.setCellValueFactory(new PropertyValueFactory<>("nombre"));`,
      }),
      line('Agrega a la lista `estudiantes` un nuevo `Estudiante(3, "Sofía", "sofia@correo.com", 21)`.', {
        checks: [[/estudiantes\.add\(new Estudiante\(3,"Sof(í|i)a","sofia@correo\.com",21\)\);/, 'estudiantes.add(new Estudiante(3, "Sofía", "sofia@correo.com", 21));']],
        solution: 'estudiantes.add(new Estudiante(3, "Sofía", "sofia@correo.com", 21));',
        explain: 'Como es una ObservableList, la tabla muestra la nueva fila sin hacer nada más.',
      }),
    ]),

    level('Validación y navegación', '🚦', [
      teoria('Validar antes de guardar',
        c(`@FXML
private void guardarEstudiante() {
    String nombre = txtNombre.getText().trim();
    String correo = txtCorreo.getText().trim();

    if (nombre.isEmpty()) {
        lblMensaje.setText("El nombre es obligatorio");
        return;                                  // corta el método
    }
    if (!correo.contains("@")) {
        lblMensaje.setText("El correo debe contener @");
        return;
    }
    int edad;
    try {
        edad = Integer.parseInt(txtEdad.getText().trim());
    } catch (NumberFormatException e) {
        lblMensaje.setText("La edad debe ser numérica");
        return;
    }
}`),
        'Para **cambiar de vista** se carga otro FXML y se pone en el Stage:',
        c(`FXMLLoader loader = new FXMLLoader(MainApp.class.getResource("form-view.fxml"));
Scene scene = new Scene(loader.load());
stage.setScene(scene);`)),
      write('Valida el correo: si `correo` **no** contiene `@`, muestra en `lblMensaje` el texto `El correo debe contener @` y sal del método con `return`.', {
        starter: `String correo = txtCorreo.getText().trim();
`,
        checks: [
          ['if(!correo.contains("@")){', 'if (!correo.contains("@"))'],
          ['lblMensaje.setText("El correo debe contener @");', 'lblMensaje.setText("El correo debe contener @");'],
          ['return;', 'return;'],
        ],
        solution: `String correo = txtCorreo.getText().trim();
if (!correo.contains("@")) {
    lblMensaje.setText("El correo debe contener @");
    return;
}`,
      }),
      write('Convierte `txtEdad` a `int edad` con `Integer.parseInt`. Si falla (`NumberFormatException`), muestra `La edad debe ser numérica` y retorna.', {
        starter: `int edad;
`,
        checks: [
          ['try{', 'Usa try'],
          [/edad=Integer\.parseInt\(txtEdad\.getText\(\)(\.trim\(\))?\);/, 'edad = Integer.parseInt(txtEdad.getText().trim());'],
          [/catch\(NumberFormatException \w+\)\{/, 'catch (NumberFormatException e)'],
          ['lblMensaje.setText("La edad debe ser numérica");', 'Muestra "La edad debe ser numérica"'],
          ['return;', 'return;'],
        ],
        solution: `int edad;
try {
    edad = Integer.parseInt(txtEdad.getText().trim());
} catch (NumberFormatException e) {
    lblMensaje.setText("La edad debe ser numérica");
    return;
}`,
      }),
      fill('Completa la navegación a la vista del formulario.',
        `FXMLLoader loader = new [[FXMLLoader]](MainApp.class.[[getResource]]("form-view.fxml"));
Scene scene = new Scene(loader.[[load]]());
stage.[[setScene]](scene);`),
      out('¿Qué queda escrito en `lblMensaje` si nombre = "Ana", correo = "ana.correo.com" y edad = "abc"?',
        `if (nombre.isEmpty()) {
    lblMensaje.setText("El nombre es obligatorio");
    return;
}
if (!correo.contains("@")) {
    lblMensaje.setText("El correo debe contener @");
    return;
}
try {
    edad = Integer.parseInt(edadTexto);
} catch (NumberFormatException e) {
    lblMensaje.setText("La edad debe ser numérica");
    return;
}
lblMensaje.setText("Estudiante guardado correctamente");`,
        'El correo debe contener @', { skipVerify: true, explain: 'La primera validación que falla hace `return`, así que las siguientes ni se revisan.' }),
    ]),

    level('Controles y eventos', '🎛️', [
      teoria('ActionEvent, CheckBox, ComboBox y binding (PPT 2.3.1)',
        c(`@FXML private CheckBox chkAcepto;
@FXML private ComboBox<String> cmbCarrera;
@FXML private TextField txtNombre;
@FXML private Label lblSaludo;

@FXML
public void initialize() {
    cmbCarrera.getItems().addAll("Informática", "Electricidad", "Mecánica");
    // binding: el Label copia solo lo que se escribe en el TextField
    lblSaludo.textProperty().bind(txtNombre.textProperty());
}

@FXML
private void onGuardar(ActionEvent event) {      // el evento del botón
    if (!chkAcepto.isSelected()) { ... }          // ¿está marcado?
    String carrera = cmbCarrera.getValue();       // opción elegida (o null)
}`),
        `<table><tr><th>Control</th><th>Leer su valor</th></tr>
<tr><td>\`TextField\`</td><td>\`getText()\`</td></tr>
<tr><td>\`CheckBox\`</td><td>\`isSelected()\`</td></tr>
<tr><td>\`ComboBox\`</td><td>\`getValue()\` (null si no eligió)</td></tr>
<tr><td>\`Label\`</td><td>\`setText(...)\` para mostrar mensajes</td></tr></table>`),
      fill('Completa el controlador.',
        `@FXML
private void onGuardar([[ActionEvent]] event) {
    if (chkAcepto.[[isSelected]]()) {
        String carrera = cmbCarrera.[[getValue]]();
        lblMensaje.[[setText]]("Carrera: " + carrera);
    }
}`),
      line('En `initialize()`, agrega al `cmbCarrera` las opciones `"Informática"` y `"Electricidad"` en una sola línea.', {
        checks: [[/cmbCarrera\.getItems\(\)\.addAll\("Inform(á|a)tica","Electricidad"\);/, 'cmbCarrera.getItems().addAll("Informática", "Electricidad");']],
        solution: 'cmbCarrera.getItems().addAll("Informática", "Electricidad");',
      }),
      write('En `onGuardar`, si el CheckBox `chkAcepto` **no** está marcado, muestra en `lblMensaje` el texto `Debes aceptar las condiciones` y sal del método.', {
        starter: `@FXML
private void onGuardar(ActionEvent event) {

}`,
        checks: [
          [['if(!chkAcepto.isSelected()){', 'if(chkAcepto.isSelected()==false){'], 'if (!chkAcepto.isSelected())'],
          ['lblMensaje.setText("Debes aceptar las condiciones");', 'lblMensaje.setText("Debes aceptar las condiciones");'],
          ['return;', 'return;'],
        ],
        solution: `@FXML
private void onGuardar(ActionEvent event) {
    if (!chkAcepto.isSelected()) {
        lblMensaje.setText("Debes aceptar las condiciones");
        return;
    }
}`,
      }),
      line('Haz que `lblVista` muestre automáticamente lo que se escribe en `txtNombre` (binding).', {
        checks: [['lblVista.textProperty().bind(txtNombre.textProperty());', 'lblVista.textProperty().bind(txtNombre.textProperty());']],
        solution: 'lblVista.textProperty().bind(txtNombre.textProperty());',
      }),
      fix('Si el usuario no elige nada, `getValue()` devuelve `null` y esto revienta con NullPointerException. Agrega la validación antes de usar `carrera`.', {
        starter: `String carrera = cmbCarrera.getValue();
if (carrera.equals("Informática")) {
    lblMensaje.setText("¡Bienvenido a Informática!");
}`,
        checks: [
          [/if\(carrera==null\)\{lblMensaje\.setText\(".+"\);return;\}/, 'if (carrera == null) { lblMensaje.setText("..."); return; }'],
          [/carrera==null\).*carrera\.equals\(/, 'La validación de null va ANTES del equals'],
        ],
        solution: `String carrera = cmbCarrera.getValue();
if (carrera == null) {
    lblMensaje.setText("Elige una carrera");
    return;
}
if (carrera.equals("Informática")) {
    lblMensaje.setText("¡Bienvenido a Informática!");
}`,
      }),
    ]),

    level('Navegación con AppNavigator', '🧭', [
      teoria('Una clase para cambiar de vista (Guía 2.3.5)',
        'Para no repetir el mismo código en cada controlador, se centraliza la navegación:',
        c(`public class AppNavigator {
    private static Stage mainStage;

    public static void setStage(Stage stage) {
        mainStage = stage;
    }

    public static void showView(String fxml, String title) {
        try {
            Parent root = FXMLLoader.load(AppNavigator.class.getResource("/view/" + fxml));
            mainStage.setTitle(title);
            mainStage.setScene(new Scene(root, 800, 500));
            mainStage.show();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

// MainApp.start(Stage stage):
AppNavigator.setStage(stage);
AppNavigator.showView("lista-view.fxml", "Listado de estudiantes");

// ListaController
@FXML
private void abrirFormulario() {
    AppNavigator.showView("form-view.fxml", "Nuevo estudiante");
}`),
        `<table><tr><th>Síntoma</th><th>Causa típica</th></tr>
<tr><td>La vista no carga</td><td>Ruta o nombre del FXML incorrecto (revisa \`resources\`)</td></tr>
<tr><td>La tabla sale vacía</td><td>Falta \`setItems(...)\` o el texto del \`PropertyValueFactory\` no coincide con el getter</td></tr>
<tr><td>El botón no hace nada</td><td>\`onAction="#metodo"\` mal escrito o falta \`@FXML\`</td></tr>
<tr><td>Campo \`@FXML\` es null</td><td>El \`fx:id\` no coincide con el nombre del atributo</td></tr>
<tr><td>No vuelve a la lista</td><td>No se llamó a \`AppNavigator.showView(...)\`</td></tr></table>`),
      fill('Completa `showView`.',
        `public static void showView(String fxml, String title) {
    try {
        Parent root = FXMLLoader.[[load]](AppNavigator.class.getResource("/view/" + fxml));
        mainStage.[[setTitle]](title);
        mainStage.[[setScene]](new [[Scene]](root, 800, 500));
        mainStage.show();
    } catch (Exception e) {
        e.printStackTrace();
    }
}`),
      line('En `ListaController.abrirFormulario()`, navega a `form-view.fxml` con el título `Nuevo estudiante`.', {
        checks: [['AppNavigator.showView("form-view.fxml","Nuevo estudiante");', 'AppNavigator.showView("form-view.fxml", "Nuevo estudiante");']],
        solution: 'AppNavigator.showView("form-view.fxml", "Nuevo estudiante");',
      }),
      write('Escribe en `FormController` el método `volverLista()` (con `@FXML`) que regrese a `lista-view.fxml` con el título `Listado de estudiantes`.', {
        starter: '',
        checks: [
          ['@FXML', 'Anota con @FXML'],
          [/(private|public) void volverLista\(\)\{/, 'private void volverLista()'],
          ['AppNavigator.showView("lista-view.fxml","Listado de estudiantes");', 'AppNavigator.showView("lista-view.fxml", "Listado de estudiantes");'],
        ],
        solution: `@FXML
private void volverLista() {
    AppNavigator.showView("lista-view.fxml", "Listado de estudiantes");
}`,
      }),
      write('Escribe el `start` de `MainApp`: guarda el stage en `AppNavigator` y muestra `lista-view.fxml` con el título `Listado de estudiantes`.', {
        starter: `@Override
public void start(Stage stage) {

}`,
        checks: [
          ['AppNavigator.setStage(stage);', 'AppNavigator.setStage(stage);'],
          ['AppNavigator.showView("lista-view.fxml","Listado de estudiantes");', 'AppNavigator.showView("lista-view.fxml", "Listado de estudiantes");'],
          [/setStage\(stage\);.*showView\(/, 'Primero setStage, después showView'],
        ],
        solution: `@Override
public void start(Stage stage) {
    AppNavigator.setStage(stage);
    AppNavigator.showView("lista-view.fxml", "Listado de estudiantes");
}`,
      }),
      fix('"El botón no hace nada". El método del controlador se llama `abrirFormulario`. Corrige el FXML.', {
        lang: 'xml',
        starter: `<Button text="Nuevo estudiante" onAction="#abrirFormularo"/>`,
        checks: [['onAction="#abrirFormulario"', 'onAction="#abrirFormulario"']],
        solution: `<Button text="Nuevo estudiante" onAction="#abrirFormulario"/>`,
      }),
    ]),
  ]),

  /* ======================= UNIDAD 11 ======================= */
  unit('Persistencia con JSON', 'Jackson, ObjectMapper, DAO y Repository', 'orange', [
    level('JSON con Jackson', '🗃️', [
      teoria('Guardar objetos como JSON',
        '**Jackson** convierte objetos Java ↔ JSON con `ObjectMapper`.',
        c(`<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.22.0</version>
</dependency>`, 'xml'),
        c(`ObjectMapper mapper = new ObjectMapper();
File archivo = new File("estudiantes.json");

// Java → JSON (guardar)
mapper.writerWithDefaultPrettyPrinter().writeValue(archivo, estudiantes);

// JSON → Java (cargar)
List<Estudiante> lista = mapper.readValue(archivo,
        new TypeReference<List<Estudiante>>(){});`),
        c(`[
  { "id": 1, "nombre": "Ana", "correo": "ana@correo.com", "edad": 20 }
]`, 'text'),
        '<div class="warn">⚠️ Jackson necesita un **constructor vacío** y getters/setters en el modelo.</div>'),
      fill('Completa la dependencia de Jackson.',
        `<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>[[jackson-databind]]</artifactId>
    <version>2.22.0</version>
</dependency>`, { lang: 'xml' }),
      fill('Guardar y cargar con ObjectMapper.',
        `mapper.[[writerWithDefaultPrettyPrinter]]().[[writeValue]](archivo, estudiantes);

return mapper.[[readValue]](archivo, new [[TypeReference]]<List<Estudiante>>(){});`),
      write('Escribe el JSON (un objeto) que representa a `new Estudiante(2, "Luis", "luis@correo.com", 22)`.', {
        lang: 'text',
        starter: '',
        checks: [
          [/^\{.*\}$/, 'Debe ser un objeto { ... }'],
          [/"id":2[,}]/, '"id": 2 (número, sin comillas)'],
          [/"nombre":"Luis"/, '"nombre": "Luis"'],
          [/"correo":"luis@correo\.com"/, '"correo": "luis@correo.com"'],
          [/"edad":22[,}]/, '"edad": 22'],
        ],
        solution: `{
  "id": 2,
  "nombre": "Luis",
  "correo": "luis@correo.com",
  "edad": 22
}`,
      }),
      fix('Jackson lanza "cannot deserialize: no default constructor". Agrega el constructor vacío.', {
        starter: `public class Estudiante {
    private int id;
    private String nombre;

    public Estudiante(int id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}`,
        checks: [['public Estudiante(){', 'Agrega public Estudiante() { }']],
        solution: `public class Estudiante {
    private int id;
    private String nombre;

    public Estudiante() {
    }

    public Estudiante(int id, String nombre) {
        this.id = id;
        this.nombre = nombre;
    }
}`,
      }),
    ]),

    level('Capa DAO', '🚪', [
      teoria('DAO: cómo se accede a los datos',
        'El **DAO** (Data Access Object) sabe leer y escribir en el origen físico (archivo JSON, base de datos...). Se define con una **interfaz** para poder cambiar la implementación sin tocar el resto.',
        c(`public interface EstudianteDao {
    List<Estudiante> cargar();
    void guardar(List<Estudiante> estudiantes);
}

public class JsonEstudianteDao implements EstudianteDao {
    private final ObjectMapper mapper = new ObjectMapper();
    private final File archivo = new File("estudiantes.json");

    @Override
    public List<Estudiante> cargar() {
        try {
            if (!archivo.exists()) {
                return new ArrayList<>();
            }
            return mapper.readValue(archivo, new TypeReference<List<Estudiante>>(){});
        } catch (IOException e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
    ...
}`)),
      write('Escribe la interfaz `EstudianteDao` con `List<Estudiante> cargar()` y `void guardar(List<Estudiante> estudiantes)`.', {
        starter: '',
        checks: [
          ['public interface EstudianteDao{', 'public interface EstudianteDao'],
          [['List<Estudiante>cargar();', 'public List<Estudiante>cargar();'], 'List<Estudiante> cargar();'],
          [['void guardar(List<Estudiante>estudiantes);', 'public void guardar(List<Estudiante>estudiantes);'], 'void guardar(List<Estudiante> estudiantes);'],
        ],
        solution: `public interface EstudianteDao {
    List<Estudiante> cargar();
    void guardar(List<Estudiante> estudiantes);
}`,
      }),
      fill('Implementa el contrato.',
        `public class JsonEstudianteDao [[implements]] EstudianteDao {
    private final ObjectMapper mapper = new [[ObjectMapper]]();
    private final File archivo = new File("[[estudiantes.json]]");

    [[@Override]]
    public void guardar(List<Estudiante> estudiantes) {
        try {
            mapper.writerWithDefaultPrettyPrinter().writeValue(archivo, estudiantes);
        } catch ([[IOException]] e) {
            e.printStackTrace();
        }
    }
}`),
      write('Escribe el inicio de `cargar()`: si el archivo **no existe**, retorna una lista vacía (`new ArrayList<>()`).', {
        starter: `@Override
public List<Estudiante> cargar() {

    return mapper.readValue(archivo, new TypeReference<List<Estudiante>>(){});
}`,
        checks: [
          ['if(!archivo.exists()){', 'if (!archivo.exists())'],
          [['return new ArrayList<>();', 'return new ArrayList<Estudiante>();'], 'return new ArrayList<>();'],
        ],
        solution: `@Override
public List<Estudiante> cargar() {
    if (!archivo.exists()) {
        return new ArrayList<>();
    }
    return mapper.readValue(archivo, new TypeReference<List<Estudiante>>(){});
}`,
      }),
    ]),

    level('Capa Repository', '🏛️', [
      teoria('Repository: cómo la app usa los datos',
        c(`public class EstudianteRepository {
    private final EstudianteDao dao = new JsonEstudianteDao();
    private final ObservableList<Estudiante> estudiantes =
            FXCollections.observableArrayList();

    public ObservableList<Estudiante> getEstudiantes() { return estudiantes; }

    public void cargarDesdeJson() { estudiantes.setAll(dao.cargar()); }

    public void guardarEnJson() { dao.guardar(estudiantes); }

    public void agregar(Estudiante e) { estudiantes.add(e); }
}`),
        `<table><tr><th>Capa</th><th>Pregunta que responde</th></tr>
<tr><td>DAO</td><td>¿Cómo se accede al archivo?</td></tr>
<tr><td>Repository</td><td>¿Cómo trabaja la app con esos datos?</td></tr>
<tr><td>Controller</td><td>¿Qué pasa cuando el usuario hace clic?</td></tr></table>`),
      line('Declara el atributo `dao` (final, privado) del tipo de la interfaz, creando un `JsonEstudianteDao`.', {
        checks: [['private final EstudianteDao dao=new JsonEstudianteDao();', 'private final EstudianteDao dao = new JsonEstudianteDao();']],
        solution: 'private final EstudianteDao dao = new JsonEstudianteDao();',
      }),
      write('Escribe `cargarDesdeJson()` (reemplaza la lista con lo que entrega el DAO usando `setAll`) y `guardarEnJson()` (manda la lista al DAO).', {
        starter: '',
        checks: [
          ['public void cargarDesdeJson(){', 'public void cargarDesdeJson()'],
          ['estudiantes.setAll(dao.cargar());', 'estudiantes.setAll(dao.cargar());'],
          ['public void guardarEnJson(){', 'public void guardarEnJson()'],
          ['dao.guardar(estudiantes);', 'dao.guardar(estudiantes);'],
        ],
        solution: `public void cargarDesdeJson() {
    estudiantes.setAll(dao.cargar());
}

public void guardarEnJson() {
    dao.guardar(estudiantes);
}`,
      }),
      fill('El controlador queda livianito: solo delega.',
        `@FXML
private void cargarJson() {
    [[repository]].cargarDesdeJson();
}

@FXML
private void guardarJson() {
    repository.[[guardarEnJson]]();
}`),
      write('Escribe `agregarEjemplo()` en el controlador: el nuevo id es el tamaño de la lista + 1, y agrega `new Estudiante(nuevoId, "Nuevo estudiante", "nuevo@correo.com", 20)` vía el repository.', {
        starter: '',
        checks: [
          [/int nuevoId=repository\.getEstudiantes\(\)\.size\(\)\+1;/, 'int nuevoId = repository.getEstudiantes().size() + 1;'],
          ['repository.agregar(new Estudiante(nuevoId,"Nuevo estudiante","nuevo@correo.com",20));', 'repository.agregar(new Estudiante(nuevoId, "Nuevo estudiante", "nuevo@correo.com", 20));'],
        ],
        solution: `@FXML
private void agregarEjemplo() {
    int nuevoId = repository.getEstudiantes().size() + 1;
    repository.agregar(new Estudiante(nuevoId, "Nuevo estudiante", "nuevo@correo.com", 20));
}`,
      }),
    ]),

    level('FileChooser y errores', '📂', [
      teoria('Elegir el archivo y no caerse (Ejercicios 2.4.4)',
        c(`FileChooser chooser = new FileChooser();
chooser.setTitle("Seleccionar archivo JSON");
chooser.getExtensionFilters().add(
        new FileChooser.ExtensionFilter("Archivos JSON", "*.json"));

File archivo = chooser.showOpenDialog(stage);   // o showSaveDialog(stage)
if (archivo != null) {                           // null = el usuario canceló
    ...
}`),
        `<table><tr><th>Problema</th><th>Cómo responde el DAO</th></tr>
<tr><td>El archivo no existe</td><td>\`if (!archivo.exists())\` → lista vacía</td></tr>
<tr><td>El archivo está vacío</td><td>\`archivo.length() == 0\` → lista vacía</td></tr>
<tr><td>JSON con errores de formato</td><td>\`catch (IOException e)\` → mensaje + lista vacía</td></tr>
<tr><td>El usuario cancela el diálogo</td><td>\`archivo == null\` → no hacer nada</td></tr></table>`,
        c(`[
  { "id": 1, "nombre": "Ana",  "correo": "ana@correo.com",  "edad": 20 },
  { "id": 2, "nombre": "Luis", "correo": "luis@correo.com", "edad": 22 }
]`, 'text')),
      fill('Completa el FileChooser.',
        `FileChooser chooser = new [[FileChooser]]();
chooser.getExtensionFilters().add(new FileChooser.[[ExtensionFilter]]("Archivos JSON", "[[*.json]]"));
File archivo = chooser.[[showOpenDialog]](stage);
if (archivo [[!=]] null) {
    repository.cargarDesde(archivo);
}`),
      write('Escribe un archivo JSON con una **lista** de 2 estudiantes: Ana (id 1, ana@correo.com, 20) y Luis (id 2, luis@correo.com, 22).', {
        lang: 'text',
        starter: '',
        checks: [
          [/^\[.*\]$/, 'Es una lista: empieza con [ y termina con ]'],
          [/\{[^}]*"nombre":"Ana"[^}]*\},\{/, 'Dos objetos { } separados por coma'],
          [/"id":1[,}]/, 'Ana tiene "id": 1'],
          [/"nombre":"Luis"/, '"nombre": "Luis"'],
          [/"correo":"luis@correo\.com"/, '"correo": "luis@correo.com"'],
          [/"edad":22[,}]/, 'Luis tiene "edad": 22'],
        ],
        solution: `[
  { "id": 1, "nombre": "Ana", "correo": "ana@correo.com", "edad": 20 },
  { "id": 2, "nombre": "Luis", "correo": "luis@correo.com", "edad": 22 }
]`,
      }),
      write('Mejora `cargar()`: si el archivo **no existe o está vacío** (`length() == 0`), retorna una lista vacía.', {
        starter: `@Override
public List<Estudiante> cargar() {
    try {

        return mapper.readValue(archivo, new TypeReference<List<Estudiante>>(){});
    } catch (IOException e) {
        e.printStackTrace();
        return new ArrayList<>();
    }
}`,
        checks: [
          [/if\(!archivo\.exists\(\)\|\|archivo\.length\(\)==0\)|if\(archivo\.length\(\)==0\|\|!archivo\.exists\(\)\)/, 'if (!archivo.exists() || archivo.length() == 0)'],
          [/\|\|archivo\.length\(\)==0\)\{?return new ArrayList<(Estudiante)?>\(\);|exists\(\)\)\{?return new ArrayList<(Estudiante)?>\(\);/, 'Dentro del if: return new ArrayList<>();'],
        ],
        solution: `@Override
public List<Estudiante> cargar() {
    try {
        if (!archivo.exists() || archivo.length() == 0) {
            return new ArrayList<>();
        }
        return mapper.readValue(archivo, new TypeReference<List<Estudiante>>(){});
    } catch (IOException e) {
        e.printStackTrace();
        return new ArrayList<>();
    }
}`,
      }),
      fix('Si el usuario presiona **Cancelar**, `showSaveDialog` devuelve `null` y esto se cae. Agrega la protección.', {
        starter: `@FXML
private void guardarComo() {
    File archivo = chooser.showSaveDialog(stage);
    repository.guardarEn(archivo);
}`,
        checks: [
          [/if\(archivo==null\)\{?return;|if\(archivo!=null\)\{?repository\.guardarEn\(archivo\);/, 'Revisa que archivo no sea null antes de guardar'],
        ],
        solution: `@FXML
private void guardarComo() {
    File archivo = chooser.showSaveDialog(stage);
    if (archivo == null) {
        return;
    }
    repository.guardarEn(archivo);
}`,
      }),
    ]),
  ]),

  /* ======================= UNIDAD 12 ======================= */
  unit('Base de datos con JDBC', 'MySQL, Connection, PreparedStatement y CRUD', 'pink', [
    level('Conexión a MySQL', '🔌', [
      teoria('Conectarse con JDBC',
        c(`<dependency>
    <groupId>com.mysql</groupId>
    <artifactId>mysql-connector-j</artifactId>
    <version>9.7.0</version>
</dependency>`, 'xml'),
        c(`public class DatabaseConnection {
    private static final String URL = "jdbc:mysql://localhost:3306/tienda_fx";
    private static final String USER = "root";
    private static final String PASSWORD = "1234";

    public static Connection getConnection() throws SQLException {
        return DriverManager.getConnection(URL, USER, PASSWORD);
    }
}

// Probar (try-with-resources cierra la conexión solo):
try (Connection con = DatabaseConnection.getConnection()) {
    System.out.println("Conexión exitosa a MySQL");
} catch (SQLException e) {
    e.printStackTrace();
}`),
        c(`CREATE TABLE producto (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);`, 'sql')),
      fill('Completa la clase de conexión.',
        `private static final String URL = "jdbc:[[mysql]]://localhost:[[3306]]/tienda_fx";

public static Connection getConnection() throws [[SQLException]] {
    return [[DriverManager]].[[getConnection]](URL, USER, PASSWORD);
}`),
      write('Prueba la conexión con **try-with-resources**: si conecta imprime `Conexión exitosa a MySQL`; si falla, captura `SQLException` e imprime la traza.', {
        starter: '',
        checks: [
          [/try\(Connection \w+=DatabaseConnection\.getConnection\(\)\)\{/, 'try (Connection con = DatabaseConnection.getConnection())'],
          ['System.out.println("Conexión exitosa a MySQL");', 'Imprime "Conexión exitosa a MySQL"'],
          [/catch\(SQLException \w+\)\{\w+\.printStackTrace\(\);/, 'catch (SQLException e) { e.printStackTrace(); }'],
        ],
        solution: `try (Connection con = DatabaseConnection.getConnection()) {
    System.out.println("Conexión exitosa a MySQL");
} catch (SQLException e) {
    e.printStackTrace();
}`,
      }),
      line('SQL: inserta un producto con nombre `Lápiz`, precio `500` y stock `10` (indicando las columnas).', {
        lang: 'sql',
        checks: [[/^insert into producto\(nombre,precio,stock\)values\('l(á|a)piz',500,10\);?$/i, "INSERT INTO producto (nombre, precio, stock) VALUES ('Lápiz', 500, 10);"]],
        solution: "INSERT INTO producto (nombre, precio, stock) VALUES ('Lápiz', 500, 10);",
      }),
      line('SQL: selecciona todos los productos con precio mayor a 1000.', {
        lang: 'sql',
        checks: [[/^select\*from producto where precio>1000;?$/i, 'SELECT * FROM producto WHERE precio > 1000;']],
        solution: 'SELECT * FROM producto WHERE precio > 1000;',
      }),
    ]),

    level('Consultas y ResultSet', '🔎', [
      teoria('Leer filas',
        c(`public List<Producto> listar() throws SQLException {
    List<Producto> lista = new ArrayList<>();
    String sql = "SELECT * FROM producto";
    try (Connection con = DatabaseConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(sql);
         ResultSet rs = ps.executeQuery()) {

        while (rs.next()) {                 // avanza fila por fila
            lista.add(new Producto(
                rs.getInt("id"),
                rs.getString("nombre"),
                rs.getDouble("precio"),
                rs.getInt("stock")));
        }
    }
    return lista;
}`),
        '<div class="tip">`executeQuery()` → SELECT (devuelve ResultSet). `executeUpdate()` → INSERT/UPDATE/DELETE (devuelve filas afectadas).</div>'),
      fill('Completa la lectura de productos.',
        `try (Connection con = DatabaseConnection.getConnection();
     PreparedStatement ps = con.[[prepareStatement]](sql);
     ResultSet rs = ps.[[executeQuery]]()) {
    while (rs.[[next]]()) {
        String nombre = rs.[[getString]]("nombre");
        int stock = rs.[[getInt]]("stock");
    }
}`),
      line('Dentro del `while`, lee la columna `precio` del ResultSet `rs` y guárdala en `double precio`.', {
        checks: [['double precio=rs.getDouble("precio");', 'double precio = rs.getDouble("precio");']],
        solution: 'double precio = rs.getDouble("precio");',
      }),
      write('Escribe el `while` que recorre `rs` y por cada fila imprime el nombre del producto.', {
        starter: '',
        checks: [
          ['while(rs.next()){', 'while (rs.next())'],
          ['System.out.println(rs.getString("nombre"));', 'System.out.println(rs.getString("nombre"));'],
        ],
        solution: `while (rs.next()) {
    System.out.println(rs.getString("nombre"));
}`,
      }),
    ]),

    level('Sentencias parametrizadas', '🛡️', [
      teoria('PreparedStatement y los ?',
        'Concatenar texto del usuario en el SQL abre la puerta a **SQL injection**. Con `PreparedStatement` usas `?` y los setters escapan los datos.',
        c(`String sql = "INSERT INTO producto (nombre, precio, stock) VALUES (?, ?, ?)";
try (Connection con = DatabaseConnection.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setString(1, p.getNombre());   // los índices parten en 1
    ps.setDouble(2, p.getPrecio());
    ps.setInt(3, p.getStock());
    int filas = ps.executeUpdate();
}`),
        '<div class="warn">⚠️ Si alguien escribe `\' OR \'1\'=\'1` en un buscador con SQL concatenado, puede ver toda la tabla.</div>'),
      fill('Completa el INSERT parametrizado.',
        `String sql = "INSERT INTO producto (nombre, precio, stock) VALUES ([[?]], [[?]], [[?]])";
PreparedStatement ps = con.prepareStatement(sql);
ps.setString([[1]], p.getNombre());
ps.[[setDouble]](2, p.getPrecio());
ps.setInt(3, p.getStock());
ps.[[executeUpdate]]();`),
      fix('¡Vulnerable a SQL injection! Reescribe usando `?` y `ps.setString(1, nombre)`.', {
        starter: `String sql = "SELECT * FROM producto WHERE nombre = '" + nombre + "'";
PreparedStatement ps = con.prepareStatement(sql);
ResultSet rs = ps.executeQuery();`,
        checks: [
          [/String sql="SELECT \* FROM producto WHERE nombre\s*=\s*\?";/i, 'String sql = "SELECT * FROM producto WHERE nombre = ?";'],
          ['ps.setString(1,nombre);', 'ps.setString(1, nombre);'],
          { not: '+nombre+', label: 'No concatenes el nombre en el SQL' },
          [/setString\(1,nombre\);ResultSet rs=ps\.executeQuery\(\);/, 'setString va antes de executeQuery()'],
        ],
        solution: `String sql = "SELECT * FROM producto WHERE nombre = ?";
PreparedStatement ps = con.prepareStatement(sql);
ps.setString(1, nombre);
ResultSet rs = ps.executeQuery();`,
      }),
      write('Escribe `public void eliminar(int id) throws SQLException` que borre el producto con ese id usando PreparedStatement.', {
        starter: '',
        checks: [
          ['public void eliminar(int id)throws SQLException{', 'public void eliminar(int id) throws SQLException'],
          [/"DELETE FROM producto WHERE id\s*=\s*\?"/i, '"DELETE FROM producto WHERE id = ?"'],
          [/prepareStatement\(/, 'Usa con.prepareStatement(sql)'],
          ['setInt(1,id);', 'ps.setInt(1, id);'],
          ['executeUpdate();', 'Ejecuta con executeUpdate()'],
        ],
        solution: `public void eliminar(int id) throws SQLException {
    String sql = "DELETE FROM producto WHERE id = ?";
    try (Connection con = DatabaseConnection.getConnection();
         PreparedStatement ps = con.prepareStatement(sql)) {
        ps.setInt(1, id);
        ps.executeUpdate();
    }
}`,
      }),
      write('Escribe el SQL y los setters para **actualizar el stock** de un producto: `UPDATE producto SET stock = ? WHERE id = ?` usando `nuevoStock` e `id`.', {
        starter: `String sql = "";
try (Connection con = DatabaseConnection.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {

    ps.executeUpdate();
}`,
        checks: [
          [/"UPDATE producto SET stock\s*=\s*\? WHERE id\s*=\s*\?"/i, '"UPDATE producto SET stock = ? WHERE id = ?"'],
          ['ps.setInt(1,nuevoStock);', 'ps.setInt(1, nuevoStock); (el primer ? es el stock)'],
          ['ps.setInt(2,id);', 'ps.setInt(2, id);'],
        ],
        solution: `String sql = "UPDATE producto SET stock = ? WHERE id = ?";
try (Connection con = DatabaseConnection.getConnection();
     PreparedStatement ps = con.prepareStatement(sql)) {
    ps.setInt(1, nuevoStock);
    ps.setInt(2, id);
    ps.executeUpdate();
}`,
      }),
      out('La tabla tiene 3 productos con stock 0. ¿Qué imprime?',
        `String sql = "DELETE FROM producto WHERE stock = ?";
PreparedStatement ps = con.prepareStatement(sql);
ps.setInt(1, 0);
int filas = ps.executeUpdate();
System.out.println("Filas afectadas: " + filas);`,
        'Filas afectadas: 3', { skipVerify: true }),
    ]),
  ]),
];
