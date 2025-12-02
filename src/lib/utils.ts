import { COLOR_MAP } from "@/constants";
import { type ClassValue, clsx } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function greet() {
  var time = new Date().getHours();
  var greeting;

  if (time >= 5 && time < 12) {
    greeting = "Good morning!";
  } else if (time >= 12 && time < 18) {
    greeting = "Good afternoon!";
  } else if (time >= 18 && time < 22) {
    greeting = "Good evening!";
  } else {
    greeting = "Good night!";
  }

  return greeting;
}

export function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .map((word) => word[0])
    .join("");
}

export function abbreviateNumber(num: number, toFixed = 1) {
  if (num >= 1e6) {
    return (num / 1e6).toFixed(toFixed) + "M";
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(toFixed) + "k";
  }
  return num?.toString();
}

export function formatNumber(number: number) {
  return new Intl.NumberFormat("en-IN", { maximumSignificantDigits: 3 }).format(
    number
  );
}

export function formatDate(date: Date) {
  const formattedDate = date.toLocaleString("en-IN");
  return formattedDate;
}

export function formatFileSize(fileSizeInBytes: number) {
  const fileSizeInKB = fileSizeInBytes / 1024;
  const fileSizeInMB = fileSizeInKB / 1024;
  const fileSizeInGB = fileSizeInMB / 1024;

  if (fileSizeInGB >= 1) {
    return fileSizeInGB.toFixed(2) + " GB";
  } else if (fileSizeInMB >= 1) {
    return fileSizeInMB.toFixed(2) + " MB";
  } else {
    return fileSizeInKB.toFixed(2) + " KB";
  }
}

export function handleToast(response: { message: string; success: boolean }) {
  response.success
    ? toast.success(response.message)
    : toast.error(response.message);
}

export function getFileFromURL(url: string) {
  return fetch(url)
    .then((response) => response.blob())
    .catch((error) => {
      console.error("Error fetching file:", error);
      throw error;
    });
}

export function limitStringWithEllipsis(str: string, maxLength: number) {
  if (str.length <= maxLength) {
    return str; // Return the original string if it's within the limit
  } else {
    return str.slice(0, maxLength - 3) + "..."; // Slice the string and add an ellipsis
  }
}

export function removeFileExtension(filename: string) {
  return filename.split(".").slice(0, -1).join(".");
}

export function getFileExtension(filename: string) {
  return filename.split(".").pop();
}

export function getColorForChar(char: string): string {
  const charObj = COLOR_MAP.find((item) => item.char === char.toLowerCase());
  return charObj ? charObj.color : "bg-black"; // return 'black' for non-alphabetic characters
}

export function getFirstChar(str: string): string {
  if (str.length === 0) {
    return "";
  }
  return str[0];
}

export function exportToExcel(data: any[], fileName: string) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
}

export function generateRandomNumbers(from: number, to: number) {
  return Math.floor(from + Math.random() * to);
}

export function calculateGST(
  price: number,
  gstRate: number,
  isInclusivePrice: boolean
) {
  // Calculate the GST amount
  let gstAmount;
  if (isInclusivePrice) {
    gstAmount = price * (gstRate / (100 + gstRate));
  } else {
    gstAmount = price * (gstRate / 100);
  }

  // Calculate the total amount including GST
  const totalAmount = price + gstAmount;

  return {
    gstAmount: gstAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
  };
}

export function convertString(input: string) {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space before uppercase letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
}

export function validateGSTIN(gstin: string) {
  const regex = /^\d{2}[A-Z]{5}\d{4}[A-Z]{1}\d[Z]{1}[A-Z\d]{1}$/;
  return regex.test(gstin) && gstin.length === 15;
}
