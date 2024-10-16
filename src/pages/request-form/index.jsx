
import { Button, Form, Input, Upload, DatePicker } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios"; // Import axios
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import AuthenLayout from "../../components/auth-layout";

const { TextArea } = Input;

const CombinedKoiRequestForm = () => {
  const [form] = Form.useForm(); // Ant Design form instance
  const navigate = useNavigate();


  const handleFormSubmit = async (values) => {
    try {
      const formData = new FormData();

      const data = {
        fullName: values.fullName,
        phone: values.phone,
        email: values.mail,
        koiDescription: values.koiDescription,
        tripDescription: values.tripDescription,
        otherRequirements: values.otherRequirements,
        tripStartDate: values.tripStartDate.format("YYYY-MM-DD"), 
        tripEndDate: values.tripEndDate.format("YYYY-MM-DD"),     
    };
    
    // Duyệt qua từng thuộc tính của đối tượng và thêm vào FormData
    for (const key in data) {
        formData.append(key, data[key]);
    }

      // Thêm ảnh vào formData (nếu có)
      if (values.images) {
        values.images.fileList.forEach((file) => {
          formData.append("images", file.originFileObj);
        });
      }

      // Gửi dữ liệu đến backend bằng axios
      const response = await axios.post("http://localhost:5000/api/submitForm", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 201) {
        toast.success("Yêu cầu của bạn đã được gửi thành công!");
        navigate("/success");
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } catch (error) {
      // Xử lý lỗi khi gửi yêu cầu
      if (error.response && error.response.data) {
        toast.error(error.response.data.error);
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  return (
    <AuthenLayout>
      <h2>Request A Trip To Koi Farm</h2>

      {/* Main Form */}
      <Form
        form={form}
        labelCol={{ span: 24 }}
        onFinish={handleFormSubmit}
        layout="vertical"
      >


        {/* Desired Koi Variety and Description */}
        <Form.Item
          label="Desired Koi Variety and Description"
          name="koiDescription"
          rules={[{ required: true, message: "Please provide a description" }]}
        >
          <TextArea
            placeholder="Describe the Koi you're looking for"
            rows={4}
          />
        </Form.Item>

        {/* Desired Trip Description */}
        <Form.Item
          label="Desired Trip and Description"
          name="tripDescription"
          rules={[{ required: true, message: "Please provide a description" }]}
        >
          <TextArea
            placeholder="Describe the trip you're looking for"
            rows={4}
          />
        </Form.Item>

        {/* Other Requirements */}
        <Form.Item
          label="Your Other Requirements"
          name="otherRequirements"
          rules={[{ required: true, message: "Please provide other requirements" }]}
        >
          <TextArea placeholder="Describe any other requirements" rows={4} />
        </Form.Item>

        {/* Desired Trip Start Date */}
        <Form.Item
          label="Desired Trip Start Date"
          name="tripStartDate"
          rules={[{ required: true, message: "Please select the start date of your trip" }]}
        >
          <DatePicker placeholder="Select the start date" />
        </Form.Item>

        {/* Desired Trip End Date */}
        <Form.Item
          label="Desired Trip End Date"
          name="tripEndDate"
          rules={[{ required: true, message: "Please select the end date of your trip" }]}
        >
          <DatePicker placeholder="Select the end date" />
        </Form.Item>

        {/* Image Upload */}
        <Form.Item label="Upload Images (Optional)">
          <Upload
            name="images"
            listType="picture"
            action="/upload" // Thay bằng API upload thực tế của bạn nếu có
            multiple
          >
            <Button icon={<UploadOutlined />}>Select Files</Button>
          </Upload>
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit Request
          </Button>
        </Form.Item>
      </Form>
    </AuthenLayout>
  );
}

export default CombinedKoiRequestForm;
