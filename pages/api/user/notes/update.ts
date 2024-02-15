import { getServerSession } from 'next-auth/next';

export default async function handle(req, res) {
    const { status } = req.body;

    const session = await getServerSession(req, res, authOptions);
    const result = await prisma.user.update({
        where: { email: session?.user?.email },
        data: {
            isOnline: status,
            latestStatusConfirmationAt: new Date(),
        },
    });
    res.json({ status: result.isOnline });
}
