import { Router } from "express";
import { mockUsers } from "../utils/constants.mjs";
import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";
import {
  createUserValidationSchema,
  filterUserValidationSchema,
} from "../utils/validation-schema.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schema/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";
import { createUserHandler, getUserByIdHandler } from "../handlers/users.mjs";
const router = Router();

router.get(
  "/api/users",
  checkSchema(filterUserValidationSchema),
  (request, response) => {
    console.log(request.session.id);
    request.sessionStore.get(request.session.id, (err, sessionData) => {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(sessionData);
    });
    const result = validationResult(request);
    if (!result.isEmpty()) {
      return response.status(400).send({ errors: result.array() });
    }
    const data = matchedData(request);
    if (Object.keys(data).length === 0 && data.constructor === Object) {
      response.send(mockUsers);
    } else {
      const queryKeyword = data.filter;
      const filteredUser = mockUsers.filter((user) =>
        user.username.includes(queryKeyword)
      );
      response.send(filteredUser);
    }
  }
);

router.get("/api/users/:id", resolveIndexByUserId, getUserByIdHandler);

// validation with User documents from database
router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  createUserHandler
);

/*
// validation with mockUser array not from database

router.post(
  "/api/users",
  checkSchema(createUserValidationSchema),
  (request, response) => {
    const result = validationResult(request);
    if (!result.isEmpty())
      return response.status(400).send({ errors: result.array() });

    const data = matchedData(request);
    const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
    mockUsers.push(newUser);
    response.status(201).send(newUser);
  }
);

*/

router.put("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  response.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { body, findUserIndex } = request;
  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return response.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (request, response) => {
  const { findUserIndex } = request;
  mockUsers.splice(findUserIndex, 1);
  return response.sendStatus(200);
});

export default router;
