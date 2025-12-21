/**
 * Swagger documentation for Orders API
 * This file contains JSDoc comments for swagger-jsdoc
 */

/**
 * @swagger
 * /api/ordenes:
 *   get:
 *     tags:
 *       - Orders
 *     summary: List all service orders
 *     description: Returns a list of all service orders with vehicle, client, and line items
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       404:
 *         description: Taller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     tags:
 *       - Orders
 *     summary: Create a new service order
 *     description: Creates a new service order with line items. Automatically calculates totals and IVA (13%)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Taller not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/ordenes/{id}:
 *   get:
 *     tags:
 *       - Orders
 *     summary: Get order details
 *     description: Returns complete details of a specific order including vehicle, client, line items, status history, and taller information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   allOf:
 *                     - $ref: '#/components/schemas/Order'
 *                     - type: object
 *                       properties:
 *                         statusHistory:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                               fromStatus:
 *                                 type: string
 *                               toStatus:
 *                                 type: string
 *                               notes:
 *                                 type: string
 *                               changedAt:
 *                                 type: string
 *                                 format: date-time
 *                         taller:
 *                           type: object
 *                           properties:
 *                             nombre:
 *                               type: string
 *                             cedulaJuridica:
 *                               type: string
 *                             telefono:
 *                               type: string
 *                             email:
 *                               type: string
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   patch:
 *     tags:
 *       - Orders
 *     summary: Update order status
 *     description: Updates the status of an existing order and creates a status history entry
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateOrderStatus'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 order:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
