import type { ComponentProps } from "react";
import React, { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";

function Chart(props: ComponentProps<typeof ApexChart>) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (mounted) return <ApexChart {...props} width="100%" />;
}

export default Chart;
