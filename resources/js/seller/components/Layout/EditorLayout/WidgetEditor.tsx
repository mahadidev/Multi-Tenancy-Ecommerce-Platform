import useWidget from "@seller/hooks/useWidget"
import { FC } from "react"

const WidgetEditor:FC = () => {
    const {widget} = useWidget()
  return (
    <div>WidgetEditor {widget?.label}</div>
  )
}
export default WidgetEditor
