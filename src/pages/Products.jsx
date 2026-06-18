import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import { getCategories } from "../api/categories";
import { getSuppliers } from "../api/suppliers";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { formatCurrency, getErrorMessage } from "../utils/format";

const emptyForm = {
  name: "",
  sku: "",
  description: "",
  category: "",
  supplier: "",
  price: "",
  quantity: "",
  lowStockThreshold: "",
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getProducts({
        page,
        search: search || undefined,
        category: categoryFilter || undefined,
        lowStock: lowStockOnly ? "true" : undefined,
      });
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories().then((res) => setCategories(res.data.data));
    getSuppliers().then((res) => setSuppliers(res.data.data));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => loadProducts(1), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, categoryFilter, lowStockOnly]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setForm({
      name: product.name,
      sku: product.sku,
      description: product.description || "",
      category: product.category?._id || "",
      supplier: product.supplier?._id || "",
      price: product.price,
      quantity: product.quantity,
      lowStockThreshold: product.lowStockThreshold,
    });
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      lowStockThreshold: Number(form.lowStockThreshold),
      supplier: form.supplier || undefined,
    };
    try {
      if (editing) {
        await updateProduct(editing._id, payload);
        toast.success("Product updated");
      } else {
        await createProduct(payload);
        toast.success("Product created");
      }
      setModalOpen(false);
      loadProducts(pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteProduct(deleteTarget._id);
      toast.success("Product deleted");
      setDeleteTarget(null);
      loadProducts(pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add Product
          </Button>
        }
      />

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or SKU..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-48"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={lowStockOnly}
              onChange={(e) => setLowStockOnly(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600"
            />
            Low stock only
          </label>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner />
          </div>
        ) : products.length === 0 ? (
          <EmptyState title="No products found" message="Try adjusting your filters or add a new product." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">SKU</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Supplier</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p._id}>
                    <td className="py-3 pr-4 font-medium text-gray-900">{p.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.sku}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.category?.name || "—"}</td>
                    <td className="py-3 pr-4 text-gray-500">{p.supplier?.name || "—"}</td>
                    <td className="py-3 pr-4">{formatCurrency(p.price)}</td>
                    <td className="py-3 pr-4">
                      {p.isLowStock ? (
                        <Badge variant="danger">{p.quantity} (low)</Badge>
                      ) : (
                        <Badge variant="success">{p.quantity}</Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4 text-right">
                      <button
                        onClick={() => openEdit(p)}
                        className="mr-2 rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(p)}
                        className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <Pagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          onChange={loadProducts}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Product" : "Add Product"}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <Input
            label="Name"
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="col-span-2"
          />
          <Input label="SKU" name="sku" required value={form.sku} onChange={handleChange} />
          <Select label="Category" name="category" required value={form.category} onChange={handleChange}>
            <option value="">Select category</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </Select>
          <Select label="Supplier" name="supplier" value={form.supplier} onChange={handleChange}>
            <option value="">None</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </Select>
          <Input
            label="Price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={handleChange}
          />
          <Input
            label="Quantity"
            name="quantity"
            type="number"
            min="0"
            value={form.quantity}
            onChange={handleChange}
          />
          <Input
            label="Low Stock Threshold"
            name="lowStockThreshold"
            type="number"
            min="0"
            value={form.lowStockThreshold}
            onChange={handleChange}
          />
          <Input
            label="Description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className="col-span-2"
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Products;
