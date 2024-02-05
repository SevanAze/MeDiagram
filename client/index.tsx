
import React from "react";
import { createRoot } from 'react-dom/client';
import App from "./App";
import SignIn from "./SignIn";

const domNode = document.getElementById('app')!;
const root = createRoot(domNode);

root.render(<SignIn />);