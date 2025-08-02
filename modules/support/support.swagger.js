/**
 * @swagger
 * tags: 
 *  name: Support
 *  description: 
 *
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    namespace:
 *      type: object
 *      required:
 *        - title
 *        - endpoint
 *      properties:
 *        title:
 *          type: string
 *          description: the title of namespace
 *        endpoint:
 *          type: string
 *          description: the endpoint of namespace
 *    room:
 *      type: object
 *      required:
 *        - name
 *        - description
 *        - namespace
 *      properties:
 *        name:
 *          type: string
 *          description: the name of room
 *        description:
 *          type: string
 *          description: the description of room
 *        image:
 *          type: array
 *          description: the image of room
 *        namespace:
 *          type: string
 *          items:
 *            type: string
 *          description: namespace of conversation
 */

/**
 * @swagger
 * /support/namespace/add:
 *  post:
 *    tags: [Support]
 *    summary: Add namespace for chatroom
 *    requestBody:
 *      required: true
 *      content: 
 *        application/x-www-form-urlencoded:
 *          schema:
 *            $ref: '#/components/schemas/namespace'
 *    responses: 
 *      201:
 *        description: Namespace created successfully
 */

/**
 * @swagger
 * /support/room/add:
 *  post:
 *    tags: [Support]
 *    summary: Add room in namespaces for chatroom
 *    requestBody:
 *      required: true
 *      content: 
 *        multipart/form-data:
 *          schema:
 *            $ref: '#/components/schemas/room'
 *    responses: 
 *      201:
 *        description: Room created successfully
 */
