import { readUsersDB, writeUsersDB } from "../../backendLibs/dbLib";
import { checkToken } from "../../backendLibs/checkToken";

export default function summaryRoute(req, res) {
  if (req.method === "GET") {
    //check authentication
    const user = checkToken(req);
    if (!user.isAdmin)
      return res.status(403).json({ ok: false, message: "Permission denied" });

    const users = readUsersDB();
    const customers = user.filter((x) => !x.isAdmin);
    const admins = users.filter((x) => x.isAdmin);
    const totalMoney = customers.reduce((pre, cur) => {
      return pre + (cur.money != null ? cur.moeny : 0);
    }, 0);

    //return response
    return res.json({
      ok: true,
      userCount: customers.length,
      adminCount: admins.length,
      totalMoney: totalMoney != null ? totalMoney : 0,
    });
  } else {
    return res.status(400).json({ ok: false, message: "Invalid HTTP Method" });
  }
}
