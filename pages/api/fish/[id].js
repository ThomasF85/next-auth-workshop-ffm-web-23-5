import fishData from "@/db/fish.json";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

async function handler(req, res) {
  const { id } = req.query;
  switch (req.method) {
    case "GET":
      try {
        const session = await getServerSession(req, res, authOptions);

        if (!session) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const fish = fishData.find((fish) => fish.id === id);
        if (!fish) {
          return res.status(404).json({ message: "fish not found" });
        }

        if (session.user.email !== fish.author) {
          return res.status(401).json({ message: "Unauthorized, wrong" });
        }
        return res.status(200).json(fish);
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "error" });
      }
    default:
      return res.status(405).json({ error: "method not allowed" });
  }
}

export default handler;
