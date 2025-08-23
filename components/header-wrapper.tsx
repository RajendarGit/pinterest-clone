"use client";

import { useState } from "react";
import { Header } from "@/components/header";

const HeaderWrapper = () => {
  const [query, setQuery] = useState("");

  return <Header onSearch={setQuery} />;
};

export default HeaderWrapper;