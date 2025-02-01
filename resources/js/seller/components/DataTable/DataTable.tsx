import "datatables.net";
import "flowbite/dist/flowbite.css";
import $ from "jquery";
import { useEffect } from "react";

const DataTable = () => {
    useEffect(() => {
        // Initialize DataTable
        $(document).ready(function () {
            $("#example").DataTable();
        });
    }, []);

    return (
        <div className="p-4">
            <table id="example" className="display w-full">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Tiger Nixon</td>
                        <td>System Architect</td>
                        <td>Edinburgh</td>
                        <td>61</td>
                        <td>2011-04-25</td>
                        <td>$320,800</td>
                    </tr>
                    <tr>
                        <td>Garrett Winters</td>
                        <td>Accountant</td>
                        <td>Tokyo</td>
                        <td>63</td>
                        <td>2011-07-25</td>
                        <td>$170,750</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
