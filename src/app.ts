//jshint esversion:6

import * as bodyParser from "body-parser";
import * as express from "express";
// import * as mongoose from 'mongoose';
import * as _ from "lodash";
import * as dotenv from "dotenv";

const app = express();

dotenv.config();
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));

interface Item {
  name: string;
};

const item1: Item = {
  name: "Boil zeals",
};

const item2: Item = {
  name: "Bake meals"
};

const item3: Item = {
  name: "Brush teeth",
};


const defaultItems = [item1, item2, item3];

interface List {
  name: string,
  items: Item[],
};

const DEFAULT_LIST_NAME = 'default';
const DEFAULT_LIST: List = {
  name: DEFAULT_LIST_NAME,
  items: defaultItems,
}

const DATABASE = new Map<string, List>([
  [DEFAULT_LIST_NAME, DEFAULT_LIST],
]);

app.get("/", function (req, res) {
  const list = DATABASE.get(DEFAULT_LIST_NAME) ?? DEFAULT_LIST;
  res.render("list", { listTitle: list.name, newListitems: list.items });
});

app.get("/:customListName", function (req, res) {
  // TODO: Implement this
  res.redirect("/");
  // const customListName = _.capitalize(req.params.customListName);
  // let list = DATABASE.get(DEFAULT_LIST_NAME);

  // if (DATABASE.get(customListName)) {
  //   list = DATABASE.get(customListName);
  // }

  // res.render("list", { listTitle: list?.name, newListitems: list?.items });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item: Item = {
    name: itemName
  };

  let list = DATABASE.get(listName);
  if (list) {
    DATABASE.set(list.name, {
      name: list.name,
      items: [...list.items, item],
    });
  } else {
    DATABASE.set(listName, {
      name: listName,
      items: [item],
    });
  }
  list = DATABASE.get(listName);
  res.render("list", { listTitle: list?.name, newListitems: list?.items });
});

app.post("/delete", function (req, res) {
  const checkedItemName = req.body.checkbox;
  const listName = req.body.listName;

  let list = DATABASE.get(listName);
  if (list) {
    DATABASE.set(list.name, {
      name: list.name,
      items: list.items.filter(i => i.name !== checkedItemName),
    });
  }
  list = DATABASE.get(listName);
  res.redirect("/");
});

const port = 3000;

app.listen(port, function () {
  console.log("Server has started Successfully.");
});
