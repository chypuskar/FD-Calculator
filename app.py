import streamlit as st
import pandas as pd

st.set_page_config(page_title="Field Dry Density (Sand Replacement)", layout="wide")
st.title("🧪 Field Dry Density Test – Sand Replacement Method")
st.caption("With Stone Displacement Correction | Multiple Test Points")

st.sidebar.header("🔧 Constant Parameters")

gamma_s = st.sidebar.number_input("Bulk Density of Sand γs (g/cc)", value=1.420, step=0.001)
Wc = st.sidebar.number_input("Weight of Sand in Cone Wc (g)", value=1028.0, step=1.0)
Gs = st.sidebar.number_input("Specific Gravity of Particles Gs", value=2.580, step=0.01)
MDD = st.sidebar.number_input("Maximum Dry Density (MDD) g/cc", value=2.301, step=0.001)

threshold = st.sidebar.selectbox("Compaction Requirement", ["95%", "98%"])
threshold_value = 95 if threshold == "95%" else 98

st.subheader("📋 Test Point Input Data")

columns = [
    "Test Location",
    "Initial Weight w1 (g)",
    "Final Weight w2 (g)",
    "Wet Soil Weight w3 (g)",
    "Wet Stone Weight w4 (g)",
    "Moisture Content (%)"
]

df = pd.DataFrame([["L",0,0,0,0,0],["C",0,0,0,0,0],["R",0,0,0,0,0]], columns=columns)
input_df = st.data_editor(df, num_rows="dynamic", use_container_width=True)

results = []

for _, r in input_df.iterrows():
    w1, w2, w3, w4, mc = r[1], r[2], r[3], r[4], r[5]
    wt_sand = w1 - w2
    Vt = wt_sand / gamma_s if gamma_s else 0
    Vs = w4 / Gs if Gs else 0
    Vsoil = Vt - Vs
    Wsoil = w3 - w4
    wet_d = Wsoil / Vsoil if Vsoil else 0
    dry_d = wet_d / (1 + mc/100) if mc >= 0 else 0
    comp = (dry_d / MDD)*100 if MDD else 0
    status = "PASS" if comp >= threshold_value else "FAIL"
    results.append([r[0], round(Vt,4), round(Vs,4), round(Vsoil,4), round(wet_d,4), round(dry_d,4), round(comp,2), status])

out = pd.DataFrame(results, columns=[
    "Location","Total Volume","Stone Volume","Soil Volume",
    "Wet Density","Dry Density","Compaction %","Result"
])

st.subheader("📊 Results")
st.dataframe(out, use_container_width=True)
