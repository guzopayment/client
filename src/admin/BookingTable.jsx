import { useEffect, useState } from "react";
import api from "../services/api";

export default function BookingTable() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    api
      .get(`/bookings?page=${page}`)
      .then((res) => setData(res.data.data || []));
  }, [page]);

  return (
    <div className="bg-white shadow rounded-xl p-6">
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th>Name</th>
            <th>Phone</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((b) => (
            <tr key={b._id}>
              <td>{b.name}</td>
              <td>{b.phone}</td>
              <td>{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between mt-6">
        <button onClick={() => setPage((p) => p - 1)}>Prev</button>

        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
