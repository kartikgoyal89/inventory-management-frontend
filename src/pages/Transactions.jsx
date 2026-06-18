import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { getTransactions, createTransaction } from "../api/transactions";
import { getProducts } from "../api/products";
import PageHeader from "../components/PageHeader";
import Card from "../components/Card";
import Button from "../components/Button";
import Input from "../components/Input";
import Select from "../components/Select";
import Modal from "../components/Modal";
import Badge from "../components/Badge";
import Spinner from "../components/Spinner";
import EmptyState from "../components/EmptyState";
import Pagination from "../components/Pagination";
import { formatDateTime, getErrorMessage } from "../utils/format";

const typeVariant = { IN: "success", OUT: "danger", ADJUSTMENT: "info" };

const emptyForm = { product: "", type: "IN", quantity: "", note: "" };

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const [productFilter, setProductFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async (page = 1) => {
    setLoading(true);
    try {
      const res = await getTransactions({
        page,
        product: productFilter || undefined,
        type: typeFilter || undefined,
      });
      setTransactions(res.data.data);
      setPagination(res.data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts({ limit: 1000 }).then((res) => setProducts(res.data.data));
  }, []);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productFilter, typeFilter]);

  const openCreate = () => {
    setForm(emptyForm);
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createTransaction({ ...form, quantity: Number(form.quantity) });
      toast.success("Transaction recorded");
      setModalOpen(false);
      load(pagination.page);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Track stock movement in and out"
        action={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> New Transaction
          </Button>
        }
      />

      <Card>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="w-56"
          >
            <option value="">All products</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku})
              </option>
            ))}
          </Select>
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-40">
            <option value="">All types</option>
            <option value="IN">IN</option>
            <option value="OUT">OUT</option>
            <option value="ADJUSTMENT">ADJUSTMENT</option>
          </Select>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <Spinner />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState title="No transactions found" message="Record a transaction to see it here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500">
                  <th className="py-2 pr-4">Product</th>
                  <th className="py-2 pr-4">Type</th>
                  <th className="py-2 pr-4">Quantity</th>
                  <th className="py-2 pr-4">Note</th>
                  <th className="py-2 pr-4">By</th>
                  <th className="py-2 pr-4">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t._id}>
                    <td className="py-3 pr-4">
                      <p className="font-medium text-gray-900">{t.product?.name}</p>
                      <p className="text-xs text-gray-500">{t.product?.sku}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <Badge variant={typeVariant[t.type]}>{t.type}</Badge>
                    </td>
                    <td className="py-3 pr-4">{t.quantity}</td>
                    <td className="py-3 pr-4 text-gray-500">{t.note || "—"}</td>
                    <td className="py-3 pr-4 text-gray-500">{t.createdBy?.name}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDateTime(t.createdAt)}</td>
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
          onChange={load}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Transaction"
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select label="Product" name="product" required value={form.product} onChange={handleChange}>
            <option value="">Select product</option>
            {products.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.sku}) &middot; {p.quantity} in stock
              </option>
            ))}
          </Select>
          <Select label="Type" name="type" required value={form.type} onChange={handleChange}>
            <option value="IN">IN — stock received</option>
            <option value="OUT">OUT — stock issued</option>
            <option value="ADJUSTMENT">ADJUSTMENT — set absolute quantity</option>
          </Select>
          <Input
            label={form.type === "ADJUSTMENT" ? "New Quantity" : "Quantity"}
            name="quantity"
            type="number"
            min="0"
            required
            value={form.quantity}
            onChange={handleChange}
          />
          <Input label="Note" name="note" value={form.note} onChange={handleChange} />
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
