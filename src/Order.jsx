function Order() {
  function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;

    const order = {
      from: form.from.value,
      to: form.to.value,
      cargo: form.cargo.value,
      name: form.name.value,
      phone: form.phone.value,
      date: new Date().toLocaleString("az-AZ"),
      status: "Yeni sifariş",
    };

    const orders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Sifarişiniz uğurla qeydə alındı!");

    form.reset();
  }

  return (
    <div className="order-page">
      <h1>Yükdaşıma sifarişi</h1>
      <p>Daşınma məlumatlarınızı daxil edin</p>

      <form onSubmit={handleSubmit}>
        <input name="from" placeholder="Haradan?" required />
        <input name="to" placeholder="Haraya?" required />
        <input name="cargo" placeholder="Yükün növü" required />
        <input name="name" placeholder="Ad və soyad" required />
        <input name="phone" placeholder="Telefon nömrəsi" required />

        <button type="submit">Sifariş yarat</button>
      </form>
    </div>
  );
}

export default Order;