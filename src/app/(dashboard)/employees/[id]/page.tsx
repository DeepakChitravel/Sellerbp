import EmployeeForm from "@/components/forms/employee-form";
import { getEmployee } from "@/lib/api/employees";
import { notFound } from "next/navigation";

const Employee = async ({ params: { id } }: { params: { id: string } }) => {
  let employee = null;
  if (id !== "add") employee = await getEmployee(id);

  // Validate the employee
  if (employee === false) return notFound();
  return (
    <>
      <h1 className="text-2xl font-bold mb-5">
        {id === "add" ? "Add" : "Edit"} Employee
      </h1>

      <EmployeeForm
        employeeId={id}
        employeeData={employee}
        isEdit={employee && true}
      />
    </>
  );
};

export default Employee;
