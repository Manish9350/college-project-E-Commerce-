import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/api";
import { useApp } from "../context/AppContext";
import "../pages/admin.css";

const AdminOrders = () => {
  const { user } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_BASE_URL}/orders?page=${page}&limit=${limit}`
      );
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchOrders();
  }, [user, page]);

  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(`${API_BASE_URL}/orders/${orderId}/status`, {
        orderStatus: status,
      });
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const deleteOrder = async (orderId) => {
    if (!confirm("Delete this order?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/orders/${orderId}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete order");
    }
  };

  const createOrderForUser = async (e) => {
    e.preventDefault();
    const userId = e.target.userId.value.trim();
    const productId = e.target.productId.value.trim();
    const qty = Number(e.target.quantity.value || 1);
    if (!userId || !productId) return alert("Provide userId and productId");

    try {
      const payload = {
        userId,
        items: [{ product: productId, quantity: qty }],
        shippingAddress: {
          street: "Admin created",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        paymentMethod: "admin-created",
      };
      await axios.post(`${API_BASE_URL}/orders/admin`, payload);
      e.target.reset();
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create order");
    }
  };

  if (!user?.isAdmin) return <p className="admin-container">Access denied.</p>;

  return (
    <div>
      <section style={{ marginBottom: 20 }}>
        <h2 className="admin-title">Create Order</h2>
        <form onSubmit={createOrderForUser} className="admin-create-form">
          <input name="userId" placeholder="User ID" />
          <input name="productId" placeholder="Product ID" />
          <input
            name="quantity"
            placeholder="Quantity"
            defaultValue={1}
            type="number"
            min={1}
          />
          <button className="admin-btn" type="submit">
            Create
          </button>
        </form>
      </section>

      <section>
        <h2 className="admin-title">Orders</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id}>
                    <td>{o._id}</td>
                    <td>{o.user?.name || o.user?.email || o.user}</td>
                    <td>
                      {o.items
                        ?.map(
                          (i) =>
                            `${i.quantity}x ${i.product?.name || i.product}`
                        )
                        .join(", ")}
                    </td>
                    <td>${o.totalAmount?.toFixed(2)}</td>
                    <td>
                      <select
                        defaultValue={o.orderStatus}
                        onBlur={(e) => updateStatus(o._id, e.target.value)}
                      >
                        <option value="pending">pending</option>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </td>
                    <td className="admin-controls">
                      <button
                        className="admin-btn"
                        onClick={() => updateStatus(o._id, "shipped")}
                      >
                        Ship
                      </button>
                      <button
                        className="admin-btn ghost"
                        onClick={() => deleteOrder(o._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AdminOrders;
