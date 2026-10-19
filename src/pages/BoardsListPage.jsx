import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Plus,
  LayoutDashboard,
  Calendar,
  Trash2,
  ArrowRight,
  Search,
  AlertTriangle,
  FolderKanban,
} from 'lucide-react';
import boardService from '../api/boardService';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const boardSchema = z.object({
  title: z.string().min(1, 'El título del tablero es obligatorio').max(80),
  description: z.string().max(250).optional(),
});

export const BoardsListPage = () => {
  const [boards, setBoards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Estados de modales
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();
  const { success, error } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(boardSchema),
  });

  const fetchBoards = async () => {
    try {
      setIsLoading(true);
      const data = await boardService.getBoards();
      setBoards(data || []);
    } catch (err) {
      error(err.message || 'Error al cargar los tableros');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, []);

  const handleCreateBoard = async (data) => {
    try {
      const newBoard = await boardService.createBoard(data);
      success('Tablero creado con éxito');
      setIsCreateOpen(false);
      reset();
      // Navegación programática estricta según AGENTS.md tras respuesta 201 OK
      navigate(`/boards/${newBoard._id}`);
    } catch (err) {
      error(err.message || 'Error al crear el tablero');
    }
  };

  const handleDeleteBoard = async () => {
    if (!boardToDelete) return;
    try {
      setIsDeleting(true);
      await boardService.deleteBoard(boardToDelete._id);
      success('Tablero y sus recursos hijos eliminados en cascada');
      setBoardToDelete(null);
      setBoards((prev) => prev.filter((b) => b._id !== boardToDelete._id));
    } catch (err) {
      error(err.message || 'Error al eliminar el tablero');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBoards = boards.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-primary text-text-main flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        {/* Encabezado y Barra de Acciones */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
          <div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-text-main tracking-tight">
              Mis Tableros
            </h1>
            <p className="text-sm text-text-muted mt-1">
              Selecciona un espacio de trabajo o crea uno nuevo para tu equipo.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Buscador */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-text-muted pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar tablero..."
                className="w-full pl-9 pr-3 py-1.5 bg-bg-surface border border-border-subtle rounded-lg text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <Button
              variant="gradient"
              onClick={() => setIsCreateOpen(true)}
              icon={Plus}
              className="flex-shrink-0"
            >
              Nuevo Tablero
            </Button>
          </div>
        </div>

        {/* Estado de Carga */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 bg-bg-card rounded-xl border border-border-subtle p-5"
              />
            ))}
          </div>
        )}

        {/* Grilla de Tableros */}
        {!isLoading && filteredBoards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBoards.map((board) => (
              <div
                key={board._id}
                className="group relative bg-bg-card rounded-xl border border-border-subtle p-6 shadow-card hover:border-accent-cyan transition-all duration-200 flex flex-col justify-between cursor-pointer"
                onClick={() => navigate(`/boards/${board._id}`)}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-9 h-9 rounded-lg bg-bg-surface flex items-center justify-center text-accent-cyan border border-border-subtle group-hover:scale-105 transition-transform">
                      <LayoutDashboard className="w-5 h-5" />
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBoardToDelete(board);
                      }}
                      className="p-1.5 rounded-md text-text-muted hover:text-status-danger hover:bg-status-danger/10 transition-colors opacity-70 group-hover:opacity-100"
                      title="Eliminar tablero"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="font-headline font-bold text-lg text-text-main group-hover:text-accent-cyan transition-colors mt-2">
                    {board.title}
                  </h3>

                  <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                    {board.description || 'Sin descripción detallada.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border-subtle flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(board.createdAt).toLocaleDateString()}
                  </span>

                  <span className="flex items-center gap-1 font-semibold text-accent-purple group-hover:translate-x-0.5 transition-transform">
                    Abrir <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Estado Vacío */}
        {!isLoading && filteredBoards.length === 0 && (
          <div className="my-16 flex flex-col items-center justify-center text-center p-12 bg-bg-card rounded-2xl border border-dashed border-border-subtle max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-bg-surface flex items-center justify-center text-accent-cyan mb-4 border border-border-subtle">
              <FolderKanban className="w-7 h-7" />
            </div>
            <h3 className="font-headline font-bold text-lg text-text-main mb-1">
              No se encontraron tableros
            </h3>
            <p className="text-xs text-text-muted max-w-sm mb-6">
              {searchQuery
                ? 'No hay ningún tablero que coincida con tu búsqueda.'
                : 'Empieza creando tu primer tablero de proyectos estilo Kanban.'}
            </p>
            <Button variant="gradient" onClick={() => setIsCreateOpen(true)} icon={Plus}>
              Crear Tablero
            </Button>
          </div>
        )}
      </main>

      {/* Modal: Crear Tablero */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => {
          setIsCreateOpen(false);
          reset();
        }}
        title="Crear Nuevo Tablero"
        showFooter={false}
      >
        <form onSubmit={handleSubmit(handleCreateBoard)} className="flex flex-col gap-4">
          <Input
            label="Título del Tablero"
            placeholder="ej. Sprint 1 - MVP"
            badge="Obligatorio"
            error={errors.title?.message}
            {...register('title')}
          />

          <Textarea
            label="Descripción"
            placeholder="Objetivos o alcance del tablero..."
            rows={3}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setIsCreateOpen(false);
                reset();
              }}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="gradient" isLoading={isSubmitting}>
              Crear Tablero
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal: Confirmar Borrado de Tablero en Cascada */}
      <Modal
        isOpen={!!boardToDelete}
        onClose={() => setBoardToDelete(null)}
        title="¿Eliminar tablero?"
        confirmText="Eliminar Tablero"
        confirmVariant="danger"
        confirmLoading={isDeleting}
        onConfirm={handleDeleteBoard}
      >
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-full bg-status-danger/15 text-status-danger flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1.5 text-xs text-text-muted">
            <p className="text-text-main font-semibold text-sm">
              Estás a punto de eliminar "{boardToDelete?.title}"
            </p>
            <p>
              Esta acción aplicará un <strong>borrado en cascada</strong> en el servidor:
              se eliminarán permanentemente todas las columnas y tickets asociados.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BoardsListPage;
