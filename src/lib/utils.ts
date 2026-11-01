export { cn } from "cn";

export function formatDeadline(deadline: Date | null) {
  if (!deadline) return "Tidak ada deadline";

  const today = new Date();
  const todayDate = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const deadlineDate = new Date(
    deadline.getFullYear(),
    deadline.getMonth(),
    deadline.getDate(),
  );

  const diffDays = Math.round(
    (deadlineDate.getTime() - todayDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  const time = new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(deadline);

  if (diffDays === 0) return `Hari ini, ${time}`;
  if (diffDays === 1) return `Besok, ${time}`;

  const date = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(deadline);

  return date;
}

const majors = {
  H14: "Ekonomi Pemabngunan",
  H24: "Manajemen",
  H34: "Agribisnis",
  H44: "Ekonomi Sumberdaya dan Lingkungan",
  H54: "Ilmu Ekonomi Syariah",
  M0401: "Statistika dan Sains Data",
  M0402: "Matematika",
  M0403: "Ilmu Komputer",
  M0404: "Aktuaria",
  M0405: "Kecerdasan Buatan",
};

export function getMajor(nim: string) {
  const majorCode = Object.keys(majors).find((code) => nim.startsWith(code));

  return {
    faculty: nim.startsWith("M")
      ? "Sekolah Sains Data, Matematika, dan Informatika"
      : nim.startsWith("H")
        ? "Fakultas Eknomi dan Manajemen"
        : undefined,
    major: majorCode ? majors[majorCode as keyof typeof majors] : undefined,
  };
}
