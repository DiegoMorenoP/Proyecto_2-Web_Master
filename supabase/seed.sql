-- Panels
INSERT INTO public.products (name, type, price, voltage, image_url, stock_status) VALUES
('SunPower Maxeon 6', 'panel', 350.00, 48, 'https://example.com/panel1.png', 'in_stock'),
('Longi Hi-MO 5', 'panel', 220.00, 42, 'https://example.com/panel2.png', 'in_stock');

-- Inverters
INSERT INTO public.products (name, type, price, image_url, stock_status) VALUES
('Huawei SUN2000-5KTL', 'inverter', 1200.00, 'https://example.com/inverter1.png', 'in_stock'),
('Fronius Primo 5.0', 'inverter', 1450.00, 'https://example.com/inverter2.png', 'low_stock');

-- Kits
INSERT INTO public.kits (name, type, total_power, price, monthly_finance_cost, description, image_url) VALUES
('Starter Eco Kit', 'grid', 3.5, 4500.00, 45.00, 'Ideal for small homes. Includes 8 panels + Huawei Inverter.', 'https://example.com/kit1.png'),
('Pro Autonomy Pack', 'hybrid', 6.0, 9800.00, 95.00, 'Full independence. 14 panels + Hybrid Inverter + 5kWh Battery.', 'https://example.com/kit2.png');
