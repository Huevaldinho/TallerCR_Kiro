/**
 * Swagger documentation for Services Catalog API
 */

/**
 * @swagger
 * /api/servicios:
 *   get:
 *     tags:
 *       - Services
 *     summary: List all services from catalog
 *     description: Returns a list of all available services with CABYS codes and suggested prices
 *     responses:
 *       200:
 *         description: List of services retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 services:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Service'
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
