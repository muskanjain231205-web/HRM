/* ===============================
   HRM DASHBOARD JS (FIXED)
================================ */

$(document).ready(function(){

  /* ---------- STATE ---------- */
  let employees  = JSON.parse(localStorage.getItem("employees"))  || [];
  let attendance = JSON.parse(localStorage.getItem("attendance")) || [];
  let leaves     = JSON.parse(localStorage.getItem("leaves"))     || [];
  let payrolls   = JSON.parse(localStorage.getItem("payrolls"))   || [];

  /* ---------- STORAGE ---------- */
  function save(key, data){
    localStorage.setItem(key, JSON.stringify(data));
  }

  /* ---------- PAGE NAVIGATION ---------- */
  function showPage(pageId){
    $(".page").addClass("hidden");
    $("#" + pageId).removeClass("hidden");

    $(".menu a").removeClass("active");
    $(`.menu a[data-page="${pageId}"]`).addClass("active");

    renderAll();
  }

  $(".menu a").click(function(){
    showPage($(this).data("page"));
  });

  /* ---------- RENDER ---------- */
  function renderAll(){
    renderEmployees();
    renderSelects();
    renderStats();
  }

  function renderEmployees(){
    if(!$("#employeeTable").length) return;

    $("#employeeTable").html("");

    employees.forEach(emp=>{
      $("#employeeTable").append(`
        <tr>
          <td>${emp.name}</td>
          <td>${emp.department}</td>
          <td><span class="status active">Active</span></td>
        </tr>
      `);
    });
  }

  function renderSelects(){
    let options = `<option value="">Select Employee</option>`;
    employees.forEach(emp=>{
      options += `<option value="${emp.id}">${emp.name}</option>`;
    });

    $("#employeeSelect, #leaveEmployee, #payrollEmployee").html(options);
  }

  function renderStats(){
    $("#totalEmployees").text(employees.length);

    const today = new Date().toLocaleDateString();
    const presentToday = attendance.filter(a => a.date === today && a.status === "present");
    $("#presentToday").text(presentToday.length);

    $("#pendingLeaves").text(leaves.length);
    $("#monthlyPayroll").text(payrolls.length);
  }

  /* ---------- ADD EMPLOYEE ---------- */
  $("#employeeForm").submit(function(e){
    e.preventDefault();

    const name = $("#name").val().trim();
    const email = $("#email").val().trim();
    const department = $("#department").val().trim();
    const type = $("#type").val();

    if(!name || !email || !department || !type) return;

    employees.push({
      id: Date.now(),
      name,
      email,
      department,
      type
    });

    save("employees", employees);
    this.reset();
    showPage("dashboardPage");
  });

  /* ---------- ATTENDANCE ---------- */
  $("#attendanceForm").submit(function(e){
    e.preventDefault();

    const empId = $("#employeeSelect").val();
    const status = $("#attendanceStatus").val();

    if(!empId || !status) return;

    attendance.push({
      id: Date.now(),
      employeeId: empId,
      status,
      date: new Date().toLocaleDateString()
    });

    save("attendance", attendance);
    this.reset();
    renderStats();
  });

  /* ---------- LEAVE ---------- */
  $("#leaveForm").submit(function(e){
    e.preventDefault();

    const empId = $("#leaveEmployee").val();
    const type = $("#leaveType").val();
    const reason = $("#leaveReason").val().trim();

    if(!empId || reason.length < 5) return;

    leaves.push({
      id: Date.now(),
      employeeId: empId,
      type,
      reason,
      date: new Date().toLocaleDateString()
    });

    save("leaves", leaves);
    this.reset();
    renderStats();
  });

  /* ---------- PAYROLL ---------- */
  $("#payrollForm").submit(function(e){
    e.preventDefault();

    const empId = $("#payrollEmployee").val();
    const month = $("#payrollMonth").val();

    if(!empId || !month) return;

    payrolls.push({
      id: Date.now(),
      employeeId: empId,
      month
    });

    save("payrolls", payrolls);
    this.reset();
    renderStats();
  });

  /* ---------- INIT ---------- */
  showPage("dashboardPage");

});