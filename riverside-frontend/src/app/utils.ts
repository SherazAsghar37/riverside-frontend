import { User } from "@/types";

export default abstract class Utils {
  static capitalize = (s: string): string => {
    if (typeof s !== "string" || s.length === 0) return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  static avatarFromName = (name: string) => {
    return !name
      ? "-"
      : name.split(" ")[0].charAt(0).toUpperCase() +
          (name.split(" ").length > 1
            ? name.split(" ")[1].charAt(0).toUpperCase()
            : "");
  };

  static renderDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
}
