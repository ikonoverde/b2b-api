import { useState, useMemo } from 'react';
import { usePage, router, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    Search,
    Bell,
    Settings,
    ChevronDown,
    Plus,
    MoreHorizontal,
    Folder,
    FolderOpen,
    GripVertical,
    Pencil,
    Trash2,
    AlertTriangle,
    X,
    ChevronRight,
    ChevronDown as ChevronDownIcon,
    Eye,
    EyeOff,
    Package,
} from 'lucide-react';
import type { PageProps, Category } from '@/types';

interface CategoriesProps extends PageProps {
    categories: Category[];
    flatCategories: Category[];
}

type ModalMode = 'create' | 'edit' | null;

interface CategoryFormModalProps {
    modalMode: NonNullable<ModalMode>;
    formData: {
        name: string;
        description: string;
        parent_id: number | null;
        is_active: boolean;
    };
    setFormData: {
        (key: 'name', value: string): void;
        (key: 'description', value: string): void;
        (key: 'parent_id', value: number | null): void;
        (key: 'is_active', value: boolean): void;
    };
    errors: Partial<Record<'name' | 'description' | 'parent_id' | 'is_active', string>>;
    processing: boolean;
    onSubmit: (e: React.FormEvent) => void;
    onClose: () => void;
    parentOptions: Category[];
}

function CategoryFormModal({
    modalMode,
    formData,
    setFormData,
    errors,
    processing,
    onSubmit,
    onClose,
    parentOptions,
}: CategoryFormModalProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-auto">
                <div className="p-6 border-b border-[#E5E5E5] flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-[#1A1A1A] font-[Outfit]">
                        {modalMode === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-[#666666]" />
                    </button>
                </div>

                <form onSubmit={onSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-[Outfit]">
                            Nombre <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData('name', e.target.value)}
                            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5D4A]/20 font-[Outfit]"
                            placeholder="Ej: Electrónicos"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 font-[Outfit]">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-[Outfit]">
                            Descripción
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData('description', e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5D4A]/20 font-[Outfit] resize-none"
                            placeholder="Descripción opcional de la categoría"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#1A1A1A] mb-2 font-[Outfit]">
                            Categoría Padre
                        </label>
                        <select
                            value={formData.parent_id ?? ''}
                            onChange={(e) => setFormData('parent_id', e.target.value ? parseInt(e.target.value) : null)}
                            className="w-full h-11 px-4 border border-[#E5E5E5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4A5D4A]/20 font-[Outfit] bg-white"
                        >
                            <option value="">Sin categoría padre (nivel raíz)</option>
                            {parentOptions.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData('is_active', e.target.checked)}
                            className="w-5 h-5 rounded border-[#E5E5E5] text-[#4A5D4A] focus:ring-[#4A5D4A]"
                        />
                        <label htmlFor="is_active" className="text-sm text-[#1A1A1A] font-[Outfit]">
                            Categoría activa (visible en la tienda)
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 h-11 border border-[#E5E5E5] rounded-lg text-[#666666] font-medium text-sm font-[Outfit] hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex-1 h-11 bg-[#4A5D4A] rounded-lg text-white font-medium text-sm font-[Outfit] hover:bg-[#3d4d3d] transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Guardando...' : (modalMode === 'create' ? 'Crear' : 'Guardar')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

interface DeleteConfirmationModalProps {
    deleteModal: {
        isOpen: boolean;
        category: Category | null;
        stats: { products_count: number; children_count: number };
    };
    onDelete: () => void;
    onClose: () => void;
}

function DeleteConfirmationModal({ deleteModal, onDelete, onClose }: DeleteConfirmationModalProps) {
    if (!deleteModal.isOpen || !deleteModal.category) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md">
                <div className="p-6 border-b border-[#E5E5E5] flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-[#1A1A1A] font-[Outfit]">
                        Eliminar Categoría
                    </h2>
                </div>

                <div className="p-6">
                    <p className="text-[#666666] mb-4 font-[Outfit]">
                        ¿Estás seguro de que quieres eliminar la categoría <strong>{deleteModal.category.name}</strong>?
                    </p>

                    {(deleteModal.stats.products_count > 0 || deleteModal.stats.children_count > 0) && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                            <p className="text-sm text-red-700 font-medium mb-2 font-[Outfit]">No se puede eliminar:</p>
                            {deleteModal.stats.children_count > 0 && (
                                <p className="text-sm text-red-600 font-[Outfit]">
                                    • Esta categoría tiene {deleteModal.stats.children_count} subcategoría(s)
                                </p>
                            )}
                            {deleteModal.stats.products_count > 0 && (
                                <p className="text-sm text-red-600 font-[Outfit]">
                                    • Esta categoría tiene {deleteModal.stats.products_count} producto(s)
                                </p>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 h-11 border border-[#E5E5E5] rounded-lg text-[#666666] font-medium text-sm font-[Outfit] hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={onDelete}
                            disabled={deleteModal.stats.products_count > 0 || deleteModal.stats.children_count > 0}
                            className="flex-1 h-11 bg-red-600 rounded-lg text-white font-medium text-sm font-[Outfit] hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface CategoryActionsProps {
    category: Category;
    onAddSubcategory: (parentId: number) => void;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
}

function CategoryActions({ category, onAddSubcategory, onEdit, onDelete }: CategoryActionsProps) {
    return (
        <div className="w-12">
            <div className="relative group/menu">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#E5E5E5] transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-[#666666]" />
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-lg shadow-lg border border-[#E5E5E5] py-1 hidden group-hover/menu:block z-10">
                    <button
                        onClick={() => onAddSubcategory(category.id)}
                        className="w-full px-4 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F9F9F9] font-[Outfit] flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Agregar subcategoría
                    </button>
                    <button
                        onClick={() => onEdit(category)}
                        className="w-full px-4 py-2 text-left text-sm text-[#1A1A1A] hover:bg-[#F9F9F9] font-[Outfit] flex items-center gap-2"
                    >
                        <Pencil className="w-4 h-4" />
                        Editar
                    </button>
                    <button
                        onClick={() => onDelete(category)}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 font-[Outfit] flex items-center gap-2"
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
}

type DeleteModalState = { isOpen: boolean; category: Category | null; stats: { products_count: number; children_count: number } };

const EMPTY_DELETE_STATE: DeleteModalState = { isOpen: false, category: null, stats: { products_count: 0, children_count: 0 } };

function useCategoryFormActions(flatCategories: Category[]) {
    const [modalMode, setModalMode] = useState<ModalMode>(null);
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { data: formData, setData: setFormData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        parent_id: null as number | null,
        is_active: true,
    });

    const closeModal = () => {
        setModalMode(null);
        setSelectedCategory(null);
        reset();
    };

    const openCreateModal = (parentId: number | null = null) => {
        reset();
        setFormData('parent_id', parentId);
        setModalMode('create');
    };

    const openEditModal = (category: Category) => {
        setSelectedCategory(category);
        setFormData({
            name: category.name,
            description: category.description ?? '',
            parent_id: category.parent_id,
            is_active: category.is_active,
        });
        setModalMode('edit');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (modalMode === 'create') {
            post('/admin/categories', { onSuccess: () => closeModal() });
        } else if (modalMode === 'edit' && selectedCategory) {
            put(`/admin/categories/${selectedCategory.id}`, { onSuccess: () => closeModal() });
        }
    };

    const getParentOptions = (currentId?: number): Category[] => {
        return flatCategories.filter(cat => cat.id !== currentId);
    };

    return {
        modalMode, selectedCategory,
        formData, setFormData, processing, errors,
        openCreateModal, openEditModal, closeModal, handleSubmit, getParentOptions,
    };
}

function useCategoryDeleteActions() {
    const [deleteModal, setDeleteModal] = useState<DeleteModalState>(EMPTY_DELETE_STATE);

    const openDeleteModal = async (category: Category) => {
        try {
            const response = await fetch(`/admin/categories/${category.id}/stats`);
            const stats = await response.json();
            setDeleteModal({ isOpen: true, category, stats });
        } catch {
            setDeleteModal({ isOpen: true, category, stats: { products_count: 0, children_count: 0 } });
        }
    };

    const handleDelete = () => {
        if (!deleteModal.category) return;
        router.delete(`/admin/categories/${deleteModal.category.id}`, {
            onSuccess: () => setDeleteModal(EMPTY_DELETE_STATE),
        });
    };

    const closeDeleteModal = () => setDeleteModal(EMPTY_DELETE_STATE);

    return { deleteModal, openDeleteModal, handleDelete, closeDeleteModal };
}

async function toggleCategoryVisibility(category: Category) {
    try {
        const response = await fetch(`/admin/categories/${category.id}/visibility`, {
            method: 'PATCH',
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            router.reload();
        }
    } catch (error) {
        console.error('Error toggling visibility:', error);
    }
}

function filterCategoryTree(categories: Category[], searchQuery: string): Category[] {
    if (!searchQuery.trim()) return categories;

    const query = searchQuery.toLowerCase();
    const matchesSearch = (cat: Category): boolean => {
        return cat.name.toLowerCase().includes(query) ||
            (cat.description?.toLowerCase().includes(query) ?? false);
    };

    const filterTree = (cats: Category[]): Category[] => {
        return cats.reduce((acc: Category[], cat) => {
            const children = cat.children ? filterTree(cat.children) : [];
            if (matchesSearch(cat) || children.length > 0) {
                acc.push({ ...cat, children });
            }
            return acc;
        }, []);
    };

    return filterTree(categories);
}

function CategoriesHeader({ searchQuery, setSearchQuery, totalCount, onCreateClick, userInitials }: {
    searchQuery: string;
    setSearchQuery: (value: string) => void;
    totalCount: number;
    onCreateClick: () => void;
    userInitials: string | undefined;
}) {
    return (
        <header className="px-8 py-6 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-[#1A1A1A] font-[Outfit]">
                    Categorías
                </h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#999999]" />
                        <input
                            type="text"
                            placeholder="Buscar categorías..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-[320px] h-11 pl-10 pr-4 bg-white border border-[#E5E5E5] rounded-lg text-sm text-[#1A1A1A] placeholder-[#999999] focus:outline-none focus:ring-2 focus:ring-[#4A5D4A]/20 font-[Outfit]"
                        />
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white transition-colors relative">
                        <Bell className="w-6 h-6 text-[#666666]" />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-[#D4A853] rounded-full"></span>
                    </button>
                    <button className="p-2 rounded-lg hover:bg-white transition-colors">
                        <Settings className="w-6 h-6 text-[#666666]" />
                    </button>
                    <div className="flex items-center gap-2 pl-4 border-l border-[#E5E5E5]">
                        <div className="w-10 h-10 bg-[#4A5D4A] rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-white font-[Outfit]">
                                {userInitials}
                            </span>
                        </div>
                        <ChevronDown className="w-5 h-5 text-[#666666]" />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-[#666666] font-[Outfit]">
                    <span>Total: {totalCount} categorías</span>
                </div>
                <button
                    onClick={onCreateClick}
                    className="flex items-center gap-2 h-11 px-5 bg-[#4A5D4A] rounded-lg text-white font-medium text-sm font-[Outfit] hover:bg-[#3d4d3d] transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Categoría
                </button>
            </div>
        </header>
    );
}

export default function Categories({ categories, flatCategories }: CategoriesProps) {
    const { auth, flash } = usePage<PageProps>().props;
    const user = auth.user;
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

    const formActions = useCategoryFormActions(flatCategories);
    const deleteActions = useCategoryDeleteActions();

    const filteredCategories = useMemo(
        () => filterCategoryTree(categories, searchQuery),
        [categories, searchQuery],
    );

    const toggleExpand = (id: number) => {
        setExpandedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    return (
        <AppLayout title="Categorías" active="categories">
            <div className="min-h-screen bg-[#FBF9F7]">
                <CategoriesHeader
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    totalCount={flatCategories.length}
                    onCreateClick={() => formActions.openCreateModal()}
                    userInitials={user?.initials}
                />

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-8 mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-700 font-[Outfit]">{flash.success}</p>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-8 mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-700 font-[Outfit]">{flash.error}</p>
                    </div>
                )}

                {/* Main Content */}
                <main className="px-8 py-6">
                    <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
                        <div className="p-4 bg-[#F9F9F9] border-b border-[#E5E5E5] flex items-center gap-4 text-sm text-[#666666] font-[Outfit]">
                            <span className="w-12"></span>
                            <span className="w-12"></span>
                            <span className="flex-1">Nombre</span>
                            <span className="w-48">Productos</span>
                            <span className="w-24">Estado</span>
                            <span className="w-12"></span>
                        </div>

                        <div className="divide-y divide-[#E5E5E5]">
                            {filteredCategories.length === 0 ? (
                                <div className="p-12 text-center">
                                    <Folder className="w-12 h-12 text-[#CCCCCC] mx-auto mb-4" />
                                    <p className="text-[#666666] font-[Outfit]">
                                        {searchQuery ? 'No se encontraron categorías' : 'No hay categorías. Crea la primera.'}
                                    </p>
                                </div>
                            ) : (
                                filteredCategories.map(category => (
                                    <CategoryRow
                                        key={category.id}
                                        category={category}
                                        depth={0}
                                        expandedIds={expandedIds}
                                        onToggleExpand={toggleExpand}
                                        onEdit={formActions.openEditModal}
                                        onDelete={deleteActions.openDeleteModal}
                                        onToggleVisibility={toggleCategoryVisibility}
                                        onAddSubcategory={formActions.openCreateModal}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </main>

                {/* Create/Edit Modal */}
                {formActions.modalMode && (
                    <CategoryFormModal
                        modalMode={formActions.modalMode}
                        formData={formActions.formData}
                        setFormData={formActions.setFormData}
                        errors={formActions.errors}
                        processing={formActions.processing}
                        onSubmit={formActions.handleSubmit}
                        onClose={formActions.closeModal}
                        parentOptions={formActions.getParentOptions(formActions.selectedCategory?.id)}
                    />
                )}

                {/* Delete Confirmation Modal */}
                <DeleteConfirmationModal
                    deleteModal={deleteActions.deleteModal}
                    onDelete={deleteActions.handleDelete}
                    onClose={deleteActions.closeDeleteModal}
                />
            </div>
        </AppLayout>
    );
}

interface CategoryRowProps {
    category: Category;
    depth: number;
    expandedIds: Set<number>;
    onToggleExpand: (id: number) => void;
    onEdit: (cat: Category) => void;
    onDelete: (cat: Category) => void;
    onToggleVisibility: (cat: Category) => void;
    onAddSubcategory: (parentId: number) => void;
}

function CategoryStatusBadge({ category, onToggleVisibility }: { category: Category; onToggleVisibility: (cat: Category) => void }) {
    return (
        <div className="w-24">
            <button
                onClick={() => onToggleVisibility(category)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium font-[Outfit] transition-colors ${
                    category.is_active
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                }`}
            >
                {category.is_active ? (
                    <><Eye className="w-3.5 h-3.5" /> Activa</>
                ) : (
                    <><EyeOff className="w-3.5 h-3.5" /> Oculta</>
                )}
            </button>
        </div>
    );
}

function CategoryInfo({ category, hasChildren }: { category: Category; hasChildren: boolean }) {
    return (
        <div className="flex-1 flex items-center gap-3">
            {hasChildren ? (
                <FolderOpen className="w-5 h-5 text-[#4A5D4A]" />
            ) : (
                <Folder className="w-5 h-5 text-[#999999]" />
            )}
            <div>
                <span className="text-sm font-medium text-[#1A1A1A] font-[Outfit]">
                    {category.name}
                </span>
                {category.description && (
                    <p className="text-xs text-[#999999] font-[Outfit] truncate max-w-xs">
                        {category.description}
                    </p>
                )}
            </div>
        </div>
    );
}

function CategoryRow({ category, depth, expandedIds, onToggleExpand, onEdit, onDelete, onToggleVisibility, onAddSubcategory }: CategoryRowProps) {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);
    const paddingLeft = 16 + (depth * 32);

    return (
        <>
            <div
                className="flex items-center gap-4 p-4 hover:bg-[#F9F9F9] transition-colors group"
                style={{ paddingLeft }}
            >
                {/* Expand Toggle */}
                <button
                    onClick={() => hasChildren && onToggleExpand(category.id)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${hasChildren ? 'hover:bg-[#E5E5E5] cursor-pointer' : 'cursor-default'}`}
                    disabled={!hasChildren}
                >
                    {hasChildren && (
                        isExpanded ?
                            <ChevronDownIcon className="w-4 h-4 text-[#666666]" /> :
                            <ChevronRight className="w-4 h-4 text-[#666666]" />
                    )}
                </button>

                {/* Drag Handle */}
                <div className="w-8 h-8 flex items-center justify-center cursor-move text-[#CCCCCC]">
                    <GripVertical className="w-4 h-4" />
                </div>

                <CategoryInfo category={category} hasChildren={!!hasChildren} />

                {/* Products Count */}
                <div className="w-48 flex items-center gap-2 text-sm text-[#666666] font-[Outfit]">
                    <Package className="w-4 h-4" />
                    <span>{category.products_count ?? 0} productos</span>
                </div>

                <CategoryStatusBadge category={category} onToggleVisibility={onToggleVisibility} />

                {/* Actions */}
                <CategoryActions
                    category={category}
                    onAddSubcategory={onAddSubcategory}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            </div>

            {/* Children */}
            {hasChildren && isExpanded && (
                category.children?.map(child => (
                    <CategoryRow
                        key={child.id}
                        category={child}
                        depth={depth + 1}
                        expandedIds={expandedIds}
                        onToggleExpand={onToggleExpand}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleVisibility={onToggleVisibility}
                        onAddSubcategory={onAddSubcategory}
                    />
                ))
            )}
        </>
    );
}
