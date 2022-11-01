import PrismaClient from "./prisma";
import { TodoDisplay } from "../models/TodoData";

/*
	This module is used by the /todos.json and /todos/[uid].json
	endpoints to make calls to api.svelte.dev, which stores todos
	for each user. The leading underscore indicates that this is
	a private module, _not_ an endpoint — visiting /todos/_api
	will net you a 404 response.

	(The data on the todo app will expire periodically; no
	guarantees are made. Don't use it to organise your life.)
*/

const prisma = new PrismaClient();

export async function api(request: Request, data?: TodoDisplay) {
  let body = {};
  let status = 500;
  switch (request.method.toUpperCase()) {
    case "GET": {
      body = await prisma.todoDisplay.findMany();
      status = 200;
      break;
    }
    // case "PATCH":
    //   body = await prisma.todo.update({
    //     data: {
    //       done: data.done,
    //       text: data.text
    //     },
    //     where: {
    //       uid: resource.split("/").pop()
    //     }
    //   })
    //   status = 200;
    //   break;
    case "POST": {
      //check if todoDisplay exists, if it does update it, otherwise create it
      let todoDisplay;
      if (data && data.id) {
        todoDisplay = await prisma.todoDisplay.findFirst({
          where: {
            uid: data.id
          }
        });
      }

      if (todoDisplay) {
        body = await prisma.todoDisplay.update({
          data: {
            title: data.title,
            todoTabs: data.
          }
        });
      } else {
        body = await prisma.todoDisplay.create({
          data: {
            uid: data.uid,
            text: data.text
          }
        });
      }
      // const todoDisplay = await prisma.todo.create({
      //
      // });
      // body = await prisma.todo.create({
      //
      // })
      // status = 201;
      break;
    }
  }

  // if the request came from a <form> submission, the browser's default
  // behaviour is to show the URL corresponding to the form's "action"
  // attribute. in those cases, we want to redirect them back to the
  // /todos page, rather than showing the response
  // if (request.method !== 'GET' && request.headers.accept !== 'application/json') {
  //   return {
  //     status: 303,
  //     headers: {
  //       location: '/todos'
  //     }
  //   };
  // }

  return {
    status,
    body
  };
}
