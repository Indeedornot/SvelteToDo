import { error, json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import PrismaClient from "$lib/prisma/prisma";
import type { TodoDisplay } from "$lib/models/TodoData";
const prisma = new PrismaClient();

//TODO: UpdateMany works only for the same data, i have to run multiple runs of update, so i have to optimize and do checkcs to see if the data is the same
export const POST: RequestHandler = async ({ request }) => {
  // const params = await request.json();
  // console.log("POST params", params);
  // return json({ params });

  const todoDisplay : TodoDisplay  = await request.json();

  if(!todoDisplay) {
    return error(400, "Bad Request");
  }

  if(todoDisplay.id){
    let todoDisp = await prisma.todoDisplay.findUnique({
      where: {
        id: todoDisplay.id
      }
    });

    //loop through the tabs and update them if the data is different
    for(let i = 0; i < todoDisplay.todoTabs.length; i++){
      const todoTab = todoDisplay.todoTabs[i];
      if(todoTab.id){
        const todoTabDb = await prisma.todoTab.findUnique({
          where: {
            id: todoTab.id
          }
        });
        if(todoTabDb){
          if(todoTabDb.title !== todoTab.title){
            await prisma.todoTab.update({
              where: {
                id: todoTab.id
              },
              data: {
                title: todoTab.title
              }
            });
          }
        }
        else{
          //create the tab
          await prisma.todoTab.create({
            data: {
              title: todoTab.title,
              todoDisplayId: todoDisplay.id
            }
          }
        }
      }
      //if does not have id - add it to the database
      else{
        await prisma.todoTab.create({
          data: {
            title: todoTab.title,
            todoDisplayId: todoDisplay.id
          }
        });
      }
    }

    //check if tododisplay exists in database and update its properties otherwise create it
    if(todoDisp){
      await prisma.todoDisplay.update({
        where: {
          id: todoDisplay.id
        },
        data: {
          title: todoDisplay.title
        }
      });
    }
    else{
      await prisma.todoDisplay.create({
        data: {
          title: todoDisplay.title
        }
      });
    }
  }
};

export const GET: RequestHandler = ({ url }) => {
  const params = url.searchParams;
  console.log("GET Params", params);
  return json({ params });
};