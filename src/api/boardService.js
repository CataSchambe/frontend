import apiClient from './client';

/**
 * ========================================================
 * SERVICIOS PARA TABLEROS (BOARDS)
 * Endpoints: /api/boards
 * ========================================================
 */

/**
 * Obtener todos los tableros
 * GET /api/boards
 * @returns {Promise<Array>} Lista de tableros
 */
export const getBoards = async () => {
  const response = await apiClient.get('/boards');
  return response.data;
};

/**
 * Obtener un tablero por ID con sus columnas pobladas
 * GET /api/boards/:boardId
 * @param {string} boardId ID del tablero
 * @returns {Promise<Object>} Tablero con array de columnas
 */
export const getBoardById = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}`);
  return response.data;
};

/**
 * Crear un nuevo tablero
 * POST /api/boards
 * @param {Object} data { title: string, description?: string }
 * @returns {Promise<Object>} Tablero creado
 */
export const createBoard = async (data) => {
  const response = await apiClient.post('/boards', data);
  return response.data;
};

/**
 * Eliminar un tablero (aplica borrado en cascada en el backend)
 * DELETE /api/boards/:boardId
 * @param {string} boardId ID del tablero
 * @returns {Promise<void>}
 */
export const deleteBoard = async (boardId) => {
  await apiClient.delete(`/boards/${boardId}`);
};

/**
 * ========================================================
 * SERVICIOS PARA COLUMNAS (COLUMNS)
 * Endpoints: /api/boards/:boardId/columns
 * ========================================================
 */

/**
 * Obtener columnas de un tablero específico
 * GET /api/boards/:boardId/columns
 * @param {string} boardId ID del tablero padre
 * @returns {Promise<Array>} Lista de columnas
 */
export const getColumns = async (boardId) => {
  const response = await apiClient.get(`/boards/${boardId}/columns`);
  return response.data;
};

/**
 * Crear una nueva columna en un tablero
 * POST /api/boards/:boardId/columns
 * @param {string} boardId ID del tablero padre
 * @param {Object} data { title: string, order?: number }
 * @returns {Promise<Object>} Columna creada
 */
export const createColumn = async (boardId, data) => {
  const response = await apiClient.post(`/boards/${boardId}/columns`, data);
  return response.data;
};

/**
 * Eliminar una columna y sus tickets asociados (cascada)
 * DELETE /api/boards/:boardId/columns/:columnId
 * @param {string} boardId ID del tablero padre
 * @param {string} columnId ID de la columna
 * @returns {Promise<void>}
 */
export const deleteColumn = async (boardId, columnId) => {
  await apiClient.delete(`/boards/${boardId}/columns/${columnId}`);
};

/**
 * ========================================================
 * SERVICIOS PARA TICKETS (TICKETS)
 * Endpoints: /api/boards/:boardId/columns/:columnId/tickets
 * ========================================================
 */

/**
 * Obtener todos los tickets de una columna específica
 * GET /api/boards/:boardId/columns/:columnId/tickets
 * @param {string} boardId ID del tablero raíz
 * @param {string} columnId ID de la columna padre
 * @returns {Promise<Array>} Lista de tickets de la columna
 */
export const getTickets = async (boardId, columnId) => {
  const response = await apiClient.get(`/boards/${boardId}/columns/${columnId}/tickets`);
  return response.data;
};

/**
 * Crear un nuevo ticket en una columna y tablero específicos
 * POST /api/boards/:boardId/columns/:columnId/tickets
 * @param {string} boardId ID del tablero raíz
 * @param {string} columnId ID de la columna padre
 * @param {Object} data { title: string, description?: string, status?: string, order?: number }
 * @returns {Promise<Object>} Ticket creado
 */
export const createTicket = async (boardId, columnId, data) => {
  const response = await apiClient.post(`/boards/${boardId}/columns/${columnId}/tickets`, data);
  return response.data;
};

/**
 * Actualizar o mover un ticket (Operación Idempotente)
 * PATCH /api/boards/:boardId/columns/:columnId/tickets/:ticketId
 * @param {string} boardId ID del tablero raíz
 * @param {string} columnId ID de la columna actual
 * @param {string} ticketId ID del ticket
 * @param {Object} updates { title?: string, description?: string, status?: string, order?: number, targetColumnId?: string }
 * @returns {Promise<Object>} Ticket actualizado
 */
export const patchTicket = async (boardId, columnId, ticketId, updates) => {
  const response = await apiClient.patch(
    `/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`,
    updates
  );
  return response.data;
};

/**
 * Eliminar un ticket específico
 * DELETE /api/boards/:boardId/columns/:columnId/tickets/:ticketId
 * @param {string} boardId ID del tablero raíz
 * @param {string} columnId ID de la columna padre
 * @param {string} ticketId ID del ticket
 * @returns {Promise<void>}
 */
export const deleteTicket = async (boardId, columnId, ticketId) => {
  await apiClient.delete(`/boards/${boardId}/columns/${columnId}/tickets/${ticketId}`);
};

/**
 * Helper para cargar el estado completo del tablero Kanban
 * (Obtiene el tablero, sus columnas y los tickets de cada columna en paralelo)
 * @param {string} boardId ID del tablero
 * @returns {Promise<Object>} Tablero con columnas y tickets integrados
 */
export const getFullBoardKanbanData = async (boardId) => {
  const board = await getBoardById(boardId);
  const columns = board.columns || [];

  // Consultar en paralelo los tickets de cada columna
  const columnsWithTickets = await Promise.all(
    columns.map(async (col) => {
      try {
        const tickets = await getTickets(boardId, col._id);
        return { ...col, tickets: tickets || [] };
      } catch (err) {
        console.error(`Error cargando tickets para columna ${col._id}:`, err);
        return { ...col, tickets: [] };
      }
    })
  );

  return {
    ...board,
    columns: columnsWithTickets,
  };
};

export default {
  getBoards,
  getBoardById,
  createBoard,
  deleteBoard,
  getColumns,
  createColumn,
  deleteColumn,
  getTickets,
  createTicket,
  patchTicket,
  deleteTicket,
  getFullBoardKanbanData,
};
