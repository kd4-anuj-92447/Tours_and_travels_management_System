function BookingHistory() {
  const bookings = [
    {
      id: 1,
      packageName: 'SunKissed Goa Escape',
      date: '10-Oct-2025',
      amount: 15000,
      status: 'Confirmed'
    },
    {
      id: 2,
      packageName: 'Himalayan Thrill – Manali',
      date: '15-Oct-2025',
      amount: 22000,
      status: 'Pending'
    }
  ]

  return (
    <div className="container">
      <h3 className="mb-4">📑 My Bookings</h3>

      <table className="table table-bordered table-hover">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Package</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((b, index) => (
            <tr key={b.id}>
              <td>{index + 1}</td>
              <td>{b.packageName}</td>
              <td>{b.date}</td>
              <td>₹{b.amount}</td>
              <td>
                <span
                  className={
                    b.status === 'Confirmed'
                      ? 'badge bg-success'
                      : 'badge bg-warning'
                  }
                >
                  {b.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default BookingHistory
