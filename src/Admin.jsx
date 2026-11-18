import React, { useEffect, useMemo, useState } from "react";

const ADMIN_PASSWORD = "RC2026Admin!";

const statuses = [
  "Yeni sifariş",
  "Qəbul edildi",
  "Daşıyıcı axtarılır",
  "Yoldadır",
  "Tamamlandı",
  "Ləğv edildi"
];

function getStatusColor(status) {
  const colors = {
    "Yeni sifariş": "#f59e0b",
    "Qəbul edildi": "#2563eb",
    "Daşıyıcı axtarılır": "#8b5cf6",
    "Yoldadır": "#0891b2",
    "Tamamlandı": "#16a34a",
    "Ləğv edildi": "#dc2626"
  };

  return colors[status] || "#64748b";
}

function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [orders, setOrders] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("orders") || "[]");
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Hamısı");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    localStorage.setItem("orders", JSON.stringify(orders));
  }, [orders]);

  function login(e) {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setPassword("");
    } else {
      alert("Şifrə yanlışdır!");
    }
  }

  function changeStatus(index, newStatus) {
    const updatedOrders = orders.map((order, i) =>
      i === index ? { ...order, status: newStatus } : order
    );

    setOrders(updatedOrders);

    if (selectedOrder !== null) {
      setSelectedOrder({ ...updatedOrders[selectedOrder] });
    }
  }

  function deleteOrder(index) {
    const confirmed = window.confirm(
      "Bu sifarişi silmək istədiyinizə əminsiniz?"
    );

    if (!confirmed) return;

    setOrders((previous) =>
      previous.filter((_, i) => i !== index)
    );

    setSelectedOrder(null);
  }

  const statistics = {
    total: orders.length,
    new: orders.filter(o => o.status === "Yeni sifariş").length,
    moving: orders.filter(o => o.status === "Yoldadır").length,
    completed: orders.filter(o => o.status === "Tamamlandı").length
  };

  const filteredOrders = useMemo(() => {
    return orders
      .map((order, index) => ({ ...order, originalIndex: index }))
      .filter(order => {
        const text = [
          order.name,
          order.phone,
          order.from,
          order.to,
          order.cargo
        ].join(" ").toLowerCase();

        const matchesSearch = text.includes(search.toLowerCase());
        const matchesFilter =
          filter === "Hamısı" || order.status === filter;

        return matchesSearch && matchesFilter;
      })
      .reverse();
  }, [orders, search, filter]);

  if (!loggedIn) {
    return (
      <div className="admin-login">
        <style>{adminStyles}</style>

        <div className="login-card">
          <div className="admin-logo">
            REGIONAL <span>CARGO</span>
          </div>

          <div className="login-icon">🔐</div>

          <h1>Admin Paneli</h1>
          <p>İdarəetmə sisteminə daxil olun</p>

          <form onSubmit={login}>
            <label>Admin şifrəsi</label>
            <input
              type="password"
              placeholder="Şifrənizi daxil edin"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              Daxil ol →
            </button>
          </form>

          <small>REGIONAL CARGO • ADMIN SYSTEM</small>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <style>{adminStyles}</style>

      <header className="admin-header">
        <div className="admin-logo">
          REGIONAL <span>CARGO</span>
        </div>

        <div className="admin-header-right">
          <span>İdarəçi paneli</span>
          <button
            className="logout-button"
            onClick={() => setLoggedIn(false)}
          >
            Çıxış
          </button>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-welcome">
          <div>
            <p className="admin-label">İDARƏETMƏ MƏRKƏZİ</p>
            <h1>Salam, Admin!</h1>
            <p>Sifarişlərinizi buradan idarə edə bilərsiniz.</p>
          </div>
          <div className="admin-date">
            {new Date().toLocaleDateString("az-AZ")}
          </div>
        </div>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <p>Ümumi sifarişlər</p>
            <h2>{statistics.total}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🆕</div>
            <p>Yeni sifarişlər</p>
            <h2>{statistics.new}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🚛</div>
            <p>Yoldadır</p>
            <h2>{statistics.moving}</h2>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <p>Tamamlanıb</p>
            <h2>{statistics.completed}</h2>
          </div>
        </section>

        <section className="orders-section">
          <div className="orders-heading">
            <div>
              <h2>Sifarişlərin idarə olunması</h2>
              <p>Bütün müştəri sifarişləri bir yerdə</p>
            </div>
            <span className="order-count">
              {filteredOrders.length} sifariş
            </span>
          </div>

          <div className="order-filters">
            <input
              type="text"
              placeholder="Ad, telefon, marşrut və ya yük axtar..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <select
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option value="Hamısı">Bütün statuslar</option>
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="empty-orders">
              <div>📭</div>
              <h3>Sifariş tapılmadı</h3>
              <p>Hələ sifariş yoxdur və ya axtarış nəticə vermədi.</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map(order => (
                <div
                  className="order-card"
                  key={order.originalIndex}
                >
                  <div className="order-card-top">
                    <span className="order-id">
                      SİFARİŞ #{String(order.originalIndex + 1).padStart(3, "0")}
                    </span>

                    <span
                      className="status-badge"
                      style={{
                        backgroundColor: getStatusColor(order.status || "Yeni sifariş")
                      }}
                    >
                      {order.status || "Yeni sifariş"}
                    </span>
                  </div>

                  <h3>{order.name || "Ad qeyd edilməyib"}</h3>

                  <a
                    className="customer-phone"
                    href={`tel:${(order.phone || "").replace(/[^\d+]/g, "")}`}
                  >
                    ☎ {order.phone || "Telefon yoxdur"}
                  </a>

                  <div className="route-box">
                    <div>
                      <small>HARADAN</small>
                      <strong>{order.from || "—"}</strong>
                    </div>
                    <span>→</span>
                    <div>
                      <small>HARAYA</small>
                      <strong>{order.to || "—"}</strong>
                    </div>
                  </div>

                  <div className="cargo-info">
                    <span>📦 Yükün növü:</span>
                    <strong>{order.cargo || "—"}</strong>
                  </div>

                  <div className="cargo-info">
                    <span>🕒 Tarix:</span>
                    <strong>{order.date || "—"}</strong>
                  </div>

                  <div className="card-actions">
                    <button
                      className="details-button"
                      onClick={() => setSelectedOrder(order.originalIndex)}
                    >
                      Ətraflı
                    </button>

                    <select
                      value={order.status || "Yeni sifariş"}
                      onChange={e =>
                        changeStatus(order.originalIndex, e.target.value)
                      }
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <button
                      className="delete-button"
                      onClick={() => deleteOrder(order.originalIndex)}
                      title="Sifarişi sil"
                    >
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {selectedOrder !== null && orders[selectedOrder] && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-modal"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedOrder(null)}
            >
              ✕
            </button>

            <h2>Sifariş məlumatları</h2>

            {[
              ["Müştəri", orders[selectedOrder].name],
              ["Telefon", orders[selectedOrder].phone],
              ["Haradan", orders[selectedOrder].from],
              ["Haraya", orders[selectedOrder].to],
              ["Yükün növü", orders[selectedOrder].cargo],
              ["Tarix", orders[selectedOrder].date],
              ["Status", orders[selectedOrder].status || "Yeni sifariş"]
            ].map(([label, value]) => (
              <div className="detail-row" key={label}>
                <span>{label}</span>
                <strong>{value || "—"}</strong>
              </div>
            ))}

            <button
              className="modal-done"
              onClick={() => setSelectedOrder(null)}
            >
              Bağla
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const adminStyles = `
.admin-panel, .admin-login {
  min-height: 100vh;
  background: #f3f6fb;
  color: #17243b;
  font-family: Arial, sans-serif;
}

.admin-header {
  background: #101d35;
  color: white;
  padding: 20px 6%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
}

.admin-logo {
  font-size: 23px;
  font-weight: 800;
  letter-spacing: 1px;
}

.admin-logo span {
  color: #f5a623;
}

.admin-header-right {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 14px;
}

.logout-button {
  background: #f5a623;
  color: #101d35;
  padding: 11px 18px;
  border-radius: 7px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.admin-main {
  max-width: 1400px;
  margin: auto;
  padding: 45px 5%;
}

.admin-welcome {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
}

.admin-label {
  color: #e99a15;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 2px;
  margin-bottom: 10px;
}

.admin-welcome h1 {
  font-size: 32px;
  margin-bottom: 8px;
}

.admin-welcome p:last-child {
  color: #718096;
  line-height: 1.6;
}

.admin-date {
  background: white;
  border: 1px solid #e5eaf1;
  padding: 12px 18px;
  border-radius: 9px;
  color: #64748b;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 18px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border: 1px solid #e5eaf1;
  padding: 23px;
  border-radius: 13px;
  box-shadow: 0 5px 18px #101d3508;
}

.stat-icon {
  font-size: 27px;
  margin-bottom: 14px;
}

.stat-card p {
  color: #718096;
  font-size: 14px;
}

.stat-card h2 {
  color: #101d35;
  font-size: 32px;
  margin-top: 9px;
}

.orders-section {
  background: white;
  padding: 28px;
  border-radius: 15px;
  border: 1px solid #e5eaf1;
}

.orders-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 25px;
}

.orders-heading h2 {
  font-size: 23px;
  margin-bottom: 8px;
}

.orders-heading p {
  color: #718096;
  font-size: 14px;
}

.order-count {
  background: #fff4df;
  color: #a86400;
  padding: 9px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: bold;
  white-space: nowrap;
}

.order-filters {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 13px;
  margin-bottom: 25px;
}

.order-filters input,
.order-filters select {
  width: 100%;
  min-width: 0;
  padding: 14px;
  border: 1px solid #dce3ed;
  border-radius: 8px;
  background: white;
  font-size: 14px;
  color: #17243b;
}

.orders-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.order-card {
  min-width: 0;
  border: 1px solid #e5eaf1;
  border-radius: 12px;
  padding: 21px;
  transition: 0.2s;
}

.order-card:hover {
  border-color: #f5a623;
  box-shadow: 0 8px 25px #101d3510;
}

.order-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 18px;
}

.order-id {
  font-size: 11px;
  color: #718096;
  font-weight: bold;
  letter-spacing: 1px;
}

.status-badge {
  color: white;
  padding: 7px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: bold;
}

.order-card h3 {
  font-size: 20px;
  margin-bottom: 8px;
}

.customer-phone {
  color: #2563eb;
  text-decoration: none;
  font-size: 14px;
}

.route-box {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  background: #f5f7fb;
  padding: 16px;
  border-radius: 9px;
  margin: 19px 0;
}

.route-box div {
  min-width: 0;
}

.route-box small {
  display: block;
  color: #718096;
  font-size: 10px;
  margin-bottom: 7px;
}

.route-box strong {
  display: block;
  font-size: 14px;
  overflow-wrap: anywhere;
}

.route-box > span {
  color: #f5a623;
  font-size: 22px;
  font-weight: bold;
}

.cargo-info {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
  margin-bottom: 12px;
}

.cargo-info span {
  color: #718096;
}

.cargo-info strong {
  text-align: right;
  overflow-wrap: anywhere;
}

.card-actions {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) 40px;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e8edf3;
}

.card-actions button,
.card-actions select {
  min-width: 0;
  padding: 11px 9px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

.details-button {
  background: #101d35;
  color: white;
}

.card-actions select {
  background: #f0f3f8;
  color: #17243b;
}

.delete-button {
  background: #fee2e2;
  color: #dc2626;
}

.empty-orders {
  text-align: center;
  padding: 65px 15px;
  color: #718096;
}

.empty-orders div {
  font-size: 45px;
  margin-bottom: 15px;
}

.empty-orders h3 {
  color: #17243b;
  margin-bottom: 10px;
}

.empty-orders p {
  font-size: 14px;
}

.admin-login {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 25px;
  background: linear-gradient(135deg, #101d35, #263b5c);
}

.login-card {
  background: white;
  width: 100%;
  max-width: 430px;
  padding: 40px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 20px 60px #0003;
}

.login-card .admin-logo {
  color: #101d35;
  margin-bottom: 35px;
}

.login-icon {
  font-size: 42px;
  margin-bottom: 15px;
}

.login-card h1 {
  color: #101d35;
  font-size: 27px;
  margin-bottom: 10px;
}

.login-card > p {
  color: #718096;
  font-size: 14px;
  margin-bottom: 28px;
}

.login-card form {
  text-align: left;
}

.login-card label {
  display: block;
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 9px;
}

.login-card input {
  width: 100%;
  padding: 15px;
  border: 1px solid #dce3ed;
  border-radius: 8px;
  font-size: 15px;
  margin-bottom: 17px;
}

.login-card form button {
  width: 100%;
  padding: 15px;
  background: #f5a623;
  color: #101d35;
  font-size: 15px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.login-card small {
  display: block;
  color: #a0aaba;
  font-size: 10px;
  letter-spacing: 1px;
  margin-top: 28px;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: #101d3580;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 1000;
}

.order-modal {
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 30px;
  border-radius: 15px;
  position: relative;
}

.order-modal h2 {
  color: #101d35;
  margin-bottom: 25px;
}

.modal-close {
  position: absolute;
  right: 20px;
  top: 18px;
  border: none;
  background: #f1f4f8;
  border-radius: 50%;
  width: 34px;
  height: 34px;
  cursor: pointer;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  padding: 13px 0;
  border-bottom: 1px solid #e8edf3;
  font-size: 14px;
}

.detail-row span {
  color: #718096;
}

.detail-row strong {
  text-align: right;
  overflow-wrap: anywhere;
}

.modal-done {
  width: 100%;
  padding: 14px;
  background: #101d35;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 23px;
  cursor: pointer;
}

@media (max-width: 850px) {
  .stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .orders-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 600px) {
  .admin-header {
    padding: 17px 5%;
  }

  .admin-logo {
    font-size: 18px;
  }

  .admin-header-right {
    gap: 10px;
    font-size: 12px;
  }

  .logout-button {
    padding: 10px;
    font-size: 11px;
  }

  .admin-main {
    padding: 28px 4%;
  }

  .admin-welcome {
    align-items: flex-start;
    flex-direction: column;
  }

  .admin-welcome h1 {
    font-size: 27px;
  }

  .stats-grid {
    gap: 10px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-card h2 {
    font-size: 27px;
  }

  .stat-card p {
    font-size: 12px;
  }

  .orders-section {
    padding: 17px;
  }

  .orders-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .orders-heading h2 {
    font-size: 20px;
  }

  .order-filters {
    grid-template-columns: 1fr;
  }

  .order-card {
    padding: 16px;
  }

  .login-card {
    padding: 30px 22px;
  }
}
`;

export default Admin;