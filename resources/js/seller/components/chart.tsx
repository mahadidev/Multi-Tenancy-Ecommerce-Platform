import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import ApexChart from "react-apexcharts";

const Chart = (props: ComponentProps<typeof ApexChart>) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    console.log(props);

    if (mounted) return <ApexChart {...props} width="100%" />;
};

export default Chart;
