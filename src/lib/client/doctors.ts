// "use client";
// import axios from "axios";

// const apiUrl = "http://localhost/managerbp/public";
// export const fetchDoctorsClient = async (userId: number) => {
//   try {
//     const res = await axios.post(
//       `${apiUrl}/seller/categories/list.php`,
//       { user_id: userId },
//       { headers: { "Content-Type": "application/json" } }
//     );

//     return res.data?.data ?? [];
//   } catch (err: any) {
//     console.log("CLIENT GET DOCTORS ERROR:", err.response?.data);
//     return [];
//   }
// };

