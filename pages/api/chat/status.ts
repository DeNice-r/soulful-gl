import {getServerSession} from "next-auth/next";
import {authOptions} from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handle(req, res) {
  const { status } = req.body;
  console.log("req -------------------------------\n", req)

  const session = await getServerSession(req, res, authOptions);
  // console.log("session --------------------------------\n", session);
  // console.log("user -----------------------------------\n", session.user);
  const result = await prisma.user.update({
    where: { email: session?.user?.email },
    data: {
      isOnline: status,
      latestStatusConfirmationAt: new Date(),
    },
  });
  res.json({status: result.isOnline});
}
