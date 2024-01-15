import { json,type LoaderFunction } from "@remix-run/node";
import { getSession} from "~/services/session.server";

export const loader : LoaderFunction = async({request}) => {
const session = await getSession(request.headers.get('Cookie'));
const oidc = session.get('oidc');
return json(oidc);
};

