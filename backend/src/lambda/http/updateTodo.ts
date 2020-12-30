import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserIdFromHeader } from '../../auth/utils'
import { updateTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('todo')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('UPDATE TODO Processing event: ', event)
  const todoId = event.pathParameters.todoId
  const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

  const userId = getUserIdFromHeader(event.headers.Authorization)

  const todo = await updateTodo(updatedTodo, todoId, userId)

  logger.info('UPDATE TODO Event complete: ', event)

  return {
    statusCode: todo ? 200 : 500,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}
