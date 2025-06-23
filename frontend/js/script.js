fetch("http://localhost:5000/api/attendees")
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector("#attendee-table tbody");
    data.forEach(attendee => {
      const row = document.createElement("tr");

      const nameCell = document.createElement("td");
      nameCell.textContent = attendee.name;

      const dobCell = document.createElement("td");
      dobCell.textContent = attendee.dob;

      const schoolCell = document.createElement("td");
      schoolCell.textContent = attendee.school;

      row.appendChild(nameCell);
      row.appendChild(dobCell);
      row.appendChild(schoolCell);

      tbody.appendChild(row);
    });
  })
  .catch(err => {
    console.error("Lỗi khi lấy dữ liệu:", err);
  });
