
import streamlit as st
st.title("Field Dry Density – Sand Replacement")

gamma=st.number_input("Bulk Density of Sand",1.420)
gs=st.number_input("Specific Gravity",2.580)
mdd=st.number_input("MDD",2.301)

rows=st.number_input("No of Tests",1,10,1)
for i in range(rows):
 st.subheader(f"Test {i+1}")
 w1=st.number_input("w1",key=f"w1{i}")
 w2=st.number_input("w2",key=f"w2{i}")
 w3=st.number_input("w3",key=f"w3{i}")
 w4=st.number_input("w4",key=f"w4{i}")
 mc=st.number_input("MC%",key=f"mc{i}")
 sand=w1-w2
 vtotal=sand/gamma if gamma else 0
 vstone=w4/gs if gs else 0
 vsoil=vtotal-vstone
 wet=(w3-w4)/vsoil if vsoil else 0
 dry=wet/(1+mc/100)
 comp=(dry/mdd)*100 if mdd else 0
 st.write("Dry Density:",round(dry,3),"Compaction %:",round(comp,1))
