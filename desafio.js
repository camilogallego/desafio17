const express = require("express");
const handlebars = require("express-handlebars");
const methodOverride = require("method-override");

const msgOptions = require("./options/sqlite3");
const msgKnex = require("knex")(msgOptions);

const productsOptions = require("./options/mariaDB");
const productKnex = require("knex")(productsOptions);

const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = 8080;
const router = express.Router();

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(express.static("./public"));

server.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
server.on("error", (error) => console.log("Error en servidor", error));

app.engine(
  "hbs",
  handlebars({
    extname: ".hbs",
    defaultLayout: "index.hbs",
  })
);

app.set("views", "./views");
app.set("view engine", "hbs");

router.get("/", (req, res) => {
  res.status(201).render("main", );
});

app.get("/productos", (req, res) => {
  productKnex
    .select("*")
    .from("products")
    .orderBy("idproducts", "asc")
    .then((products) => {
      if (products.length) {
        res.render("index", {
          ok: true,
          updateForm: false,
          error: null,
          products: products,
        });
      } else {
        res.render("index", {
          ok: false,
          error: "No hay products cargados",
          productos: [],
        });
      }
    })
    .catch((e) => {
      console.log("Error getting products: ", e);
      productKnex.destroy();
    });
});

app.post("/agregar", (req, res) => {
  productKnex("products")
    .insert(req.body)
    .then(() => {
      console.log("producto insertado");
      res.redirect("/productos");
    })
    .catch((e) => {
      console.log("Error en Insert producto: ", e);
      productKnex.destroy;
    });
});

app.get("/productos/editar/:idprod", (req, res) => {
  let id = req.params.idprod;

  productKnex("products")
    .first()
    .where({ idproducts: id })
    .then((product) => {
      res.render("index", {
        product: product,
        updateForm: true,
        viewTitle: "Editar producto",
        errorMessage: "No hay productos.",
      });
    })
    .catch((e) => {
      console.log("Error getting products: ", e);
      productKnex.destroy();
    });
});

app.put("/productos/ed/:idprod", (req, res) => {
  let id = req.params.idprod;
  console.log(req.body);
  productKnex("products")
    .update(req.body)
    .where({ idproducts: id })
    .then((prod) => {
      console.log("producto actualizado: ", prod);
      res.redirect("/productos");
    })
    .catch((e) => {
      console.log("Error en Update producto: ", e);
      productKnex.destroy;
    });
});

app.delete("/productos/borrar/:idprod", (req, res) => {
  let id = req.params.idprod;
  productKnex("products")
    .del()
    .where({ idproducts: id })
    .then((prod) => {
      console.log("producto eliminado: ", prod);
      res.redirect("/productos");
    })
    .catch((e) => {
      console.log("Error en Delete producto: ", e);
      productKnex.destroy;
    });
});

io.on("connection", (socket) => {
  console.log("nuevo cliente coencetado");

  function selectAllMessages() {
    msgKnex
      .select("*")
      .from("mensajes")
      .orderBy("date", "desc")
      .then((messages) => {
        socket.emit("mensajes", );
      })
      .catch((e) => {
        console.log("Error getting messages: ", e);
        msgKnex.destroy();
      });
  }
  selectAllMessages();

  productKnex
    .select("*")
    .from("products")
    .orderBy("idproducts", "asc")
    .then((products) => {
      socket.emit("productos", {
        products: products,
        updateForm: false,
        viewTitle: "Listado de productos",
        errorMessage: "No hay productos.",
      });
    })
    .catch((e) => {
      console.log("Error getting products: ", e);
      productKnex.destroy();
    });

  socket.on("nuevo", (envio) => {
    msgKnex("messages")
      .insert(envio)
      .then(() => {
        console.log("Mensaje insertado");
        selectAllMessages();
        return false;
      })
      .catch((e) => {
        console.log("Error en Insert message: ", e);
        msgKnex.destroy;
      });
  });
});
